import { ConfigService } from '@nestjs/config';
export declare class TelegramService {
    private config;
    private readonly token;
    private readonly chatId;
    constructor(config: ConfigService);
    send(message: string): Promise<void>;
    escapeHtml(text: string): string;
}
