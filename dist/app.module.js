"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cache_manager_1 = require("@nestjs/cache-manager");
const schedule_1 = require("@nestjs/schedule");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const blog_module_1 = require("./blog/blog.module");
const admin_blog_module_1 = require("./admin/blog/admin-blog.module");
const upload_module_1 = require("./upload/upload.module");
const telegram_module_1 = require("./telegram/telegram.module");
const calculator_module_1 = require("./calculator/calculator.module");
const submissions_module_1 = require("./submissions/submissions.module");
const admin_calculator_module_1 = require("./admin/calculator/admin-calculator.module");
const chat_module_1 = require("./chat/chat.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            cache_manager_1.CacheModule.register({
                ttl: 60000,
                isGlobal: true,
            }),
            schedule_1.ScheduleModule.forRoot(),
            prisma_module_1.PrismaModule,
            telegram_module_1.TelegramModule,
            auth_module_1.AuthModule,
            blog_module_1.BlogModule,
            admin_blog_module_1.AdminBlogModule,
            upload_module_1.UploadModule,
            calculator_module_1.CalculatorModule,
            submissions_module_1.SubmissionsModule,
            admin_calculator_module_1.AdminCalculatorModule,
            chat_module_1.ChatModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map