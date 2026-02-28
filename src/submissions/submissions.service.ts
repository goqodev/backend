import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TelegramService } from '../telegram/telegram.service';
import { CreateCalculatorSubmissionDto } from './dto/create-calculator-submission.dto';
import { CreateContactSubmissionDto } from './dto/create-contact-submission.dto';

@Injectable()
export class SubmissionsService {
  constructor(
    private prisma: PrismaService,
    private telegram: TelegramService,
  ) {}

  async submitCalculator(data: CreateCalculatorSubmissionDto) {
    const row = await this.prisma.submission.create({
      data: {
        source: 'calculator',
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        message: data.description || null,
        projectType: data.projectType,
        designLevel: data.designLevel || null,
        features: JSON.stringify(data.features),
        scopeModifiers: JSON.stringify(data.scopeModifiers),
        adBudget: data.adBudget || null,
        priceMin: data.priceMin,
        priceMax: data.priceMax,
        isMonthly: data.isMonthly,
        labels: JSON.stringify(data.labels),
      },
    });

    const esc = this.telegram.escapeHtml.bind(this.telegram);
    const monthlySuffix = data.isMonthly ? '/мес' : '';
    const { labels } = data;

    let msg =
      `<b>🧮 Новая заявка из калькулятора</b>\n\n` +
      `<b>Имя:</b> ${esc(data.name)}\n` +
      `<b>Email:</b> ${esc(data.email)}\n` +
      (data.phone ? `<b>Телефон:</b> ${esc(data.phone)}\n` : '') +
      `\n<b>💰 €${data.priceMin.toLocaleString()} — €${data.priceMax.toLocaleString()}${monthlySuffix}</b>\n` +
      `\n<b>Выбранные параметры:</b>\n` +
      `Тип проекта: <b>${esc(labels.projectType)}</b>\n` +
      (labels.designLevel
        ? `Уровень дизайна: <b>${esc(labels.designLevel)}</b>\n`
        : '');

    for (const mod of labels.scopeModifiers) {
      msg += `${esc(mod.label)}: <b>${esc(mod.value)}</b>\n`;
    }

    if (labels.adBudget) {
      msg += `Рекл. бюджет: <b>${esc(labels.adBudget)}</b>\n`;
    }

    if (labels.features.length > 0) {
      msg += `\n<b>Функции:</b>\n`;
      for (const f of labels.features) {
        msg += `• ${esc(f.name)}  €${f.priceMin} — €${f.priceMax}${monthlySuffix}\n`;
      }
    }

    if (data.description) {
      msg += `\n<b>Описание:</b> ${esc(data.description)}`;
    }

    this.telegram.send(msg);

    return { success: true, id: row.id };
  }

  async submitContact(data: CreateContactSubmissionDto) {
    const row = await this.prisma.submission.create({
      data: {
        source: 'contact',
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        message: data.message || null,
        solutions: JSON.stringify(data.solutions),
        serviceTypes: JSON.stringify(data.serviceTypes),
        budget: data.budget || null,
      },
    });

    const esc = this.telegram.escapeHtml.bind(this.telegram);

    this.telegram.send(
      `<b>📩 Новая заявка с контактной формы</b>\n\n` +
        `<b>Имя:</b> ${esc(data.name)}\n` +
        `<b>Email:</b> ${esc(data.email)}\n` +
        (data.phone ? `<b>Телефон:</b> ${esc(data.phone)}\n` : '') +
        (data.solutions.length > 0
          ? `\n<b>Решения:</b> ${esc(data.solutions.join(', '))}\n`
          : '') +
        (data.serviceTypes.length > 0
          ? `<b>Услуги:</b> ${esc(data.serviceTypes.join(', '))}\n`
          : '') +
        (data.budget ? `<b>Бюджет:</b> ${esc(data.budget)}\n` : '') +
        (data.message ? `\n<b>Сообщение:</b> ${esc(data.message)}` : ''),
    );

    return { success: true, id: row.id };
  }

  async findAll() {
    return this.prisma.submission.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.submission.findUnique({ where: { id } });
  }

  async remove(id: number) {
    await this.prisma.submission.delete({ where: { id } });
    return { success: true };
  }
}
