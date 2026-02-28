import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Sse,
  MessageEvent,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('messages')
  async sendMessage(@Body() dto: CreateMessageDto) {
    const message = await this.chatService.sendUserMessage(
      dto.sessionId,
      dto.name,
      dto.text,
    );
    return { success: true, message };
  }

  @Get('messages/:sessionId')
  async getMessages(@Param('sessionId') sessionId: string) {
    return this.chatService.getMessages(sessionId);
  }

  @Sse('events/:sessionId')
  sse(@Param('sessionId') sessionId: string): Observable<MessageEvent> {
    return this.chatService.getMessageStream(sessionId);
  }

  @Post('webhook')
  async telegramWebhook(@Body() body: any) {
    await this.chatService.handleTelegramWebhook(body);
    return { ok: true };
  }
}
