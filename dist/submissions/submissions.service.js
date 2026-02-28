"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const telegram_service_1 = require("../telegram/telegram.service");
let SubmissionsService = class SubmissionsService {
    constructor(prisma, telegram) {
        this.prisma = prisma;
        this.telegram = telegram;
    }
    async submitCalculator(data) {
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
        let msg = `<b>🧮 Новая заявка из калькулятора</b>\n\n` +
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
    async submitContact(data) {
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
        this.telegram.send(`<b>📩 Новая заявка с контактной формы</b>\n\n` +
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
            (data.message ? `\n<b>Сообщение:</b> ${esc(data.message)}` : ''));
        return { success: true, id: row.id };
    }
    async findAll() {
        return this.prisma.submission.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        return this.prisma.submission.findUnique({ where: { id } });
    }
    async remove(id) {
        await this.prisma.submission.delete({ where: { id } });
        return { success: true };
    }
};
exports.SubmissionsService = SubmissionsService;
exports.SubmissionsService = SubmissionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        telegram_service_1.TelegramService])
], SubmissionsService);
//# sourceMappingURL=submissions.service.js.map