import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { AdminBlogModule } from './admin/blog/admin-blog.module';
import { UploadModule } from './upload/upload.module';
import { TelegramModule } from './telegram/telegram.module';
import { CalculatorModule } from './calculator/calculator.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { AdminCalculatorModule } from './admin/calculator/admin-calculator.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({
      ttl: 60000, // 60s default
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    TelegramModule,
    AuthModule,
    BlogModule,
    AdminBlogModule,
    UploadModule,
    CalculatorModule,
    SubmissionsModule,
    AdminCalculatorModule,
    ChatModule,
  ],
})
export class AppModule {}
