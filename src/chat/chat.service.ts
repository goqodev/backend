import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

interface SseMessage {
  sessionId: string;
  data: {
    id: number;
    sender: 'USER' | 'ADMIN';
    text: string;
    createdAt: string;
  };
}

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly messageSubject = new Subject<SseMessage>();
  private readonly botToken: string;
  private readonly liveChatId: string;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.botToken = this.config.get<string>('TELEGRAM_BOT_TOKEN', '');
    this.liveChatId = this.config.get<string>('TELEGRAM_LIVE_CHAT_ID', '');
  }

  getMessageStream(sessionId: string): Observable<MessageEvent> {
    return this.messageSubject.pipe(
      filter((msg) => msg.sessionId === sessionId),
      map((msg) => ({ data: msg.data }) as MessageEvent),
    );
  }

  async findOrCreateConversation(sessionId: string, name: string) {
    let conversation = await this.prisma.chatConversation.findUnique({
      where: { visitorSessionId: sessionId },
    });

    if (!conversation) {
      conversation = await this.prisma.chatConversation.create({
        data: {
          visitorName: name,
          visitorSessionId: sessionId,
          status: 'open',
        },
      });
    }

    return conversation;
  }

  async sendUserMessage(sessionId: string, name: string, text: string) {
    const conversation = await this.findOrCreateConversation(sessionId, name);

    const message = await this.prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        sender: 'USER',
        text,
      },
    });

    this.messageSubject.next({
      sessionId,
      data: {
        id: message.id,
        sender: 'USER',
        text: message.text,
        createdAt: message.createdAt.toISOString(),
      },
    });

    await this.sendToTelegram(conversation, name, text);

    return message;
  }

  async getMessages(sessionId: string) {
    const conversation = await this.prisma.chatConversation.findUnique({
      where: { visitorSessionId: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          select: { id: true, sender: true, text: true, createdAt: true },
        },
      },
    });

    return conversation?.messages || [];
  }

  async handleTelegramWebhook(body: any) {
    const msg = body?.message;
    if (!msg?.reply_to_message?.text) return;

    const originalText = msg.reply_to_message.text;
    const convMatch = originalText.match(/#conv-([a-f0-9-]+)/);
    if (!convMatch) return;

    const conversationId = convMatch[1];
    const replyText = msg.text;
    if (!replyText) return;

    const conversation = await this.prisma.chatConversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      this.logger.warn(`Conversation ${conversationId} not found for webhook`);
      return;
    }

    const message = await this.prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        sender: 'ADMIN',
        text: replyText,
      },
    });

    this.messageSubject.next({
      sessionId: conversation.visitorSessionId,
      data: {
        id: message.id,
        sender: 'ADMIN',
        text: message.text,
        createdAt: message.createdAt.toISOString(),
      },
    });
  }

  private async sendToTelegram(
    conversation: { id: string; telegramMessageId: number | null },
    name: string,
    text: string,
  ) {
    if (!this.botToken || !this.liveChatId) return;

    const escapedName = this.escapeHtml(name);
    const escapedText = this.escapeHtml(text);

    const telegramMsg =
      `💬 Live Chat — #conv-${conversation.id}\n` +
      `👤 <b>${escapedName}</b>\n\n` +
      `${escapedText}`;

    try {
      const payload: Record<string, any> = {
        chat_id: this.liveChatId,
        text: telegramMsg,
        parse_mode: 'HTML',
      };

      if (conversation.telegramMessageId) {
        payload.reply_to_message_id = conversation.telegramMessageId;
      }

      const res = await fetch(
        `https://api.telegram.org/bot${this.botToken}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (!conversation.telegramMessageId && data.ok && data.result?.message_id) {
        await this.prisma.chatConversation.update({
          where: { id: conversation.id },
          data: { telegramMessageId: data.result.message_id },
        });
      }
    } catch (err) {
      this.logger.error('Failed to send to Telegram', err);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async cleanupOldChats() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count } = await this.prisma.chatConversation.deleteMany({
      where: { createdAt: { lt: thirtyDaysAgo } },
    });

    if (count > 0) {
      this.logger.log(`Cleaned up ${count} old chat conversations`);
    }
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}
