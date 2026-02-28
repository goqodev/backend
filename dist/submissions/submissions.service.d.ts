import { PrismaService } from '../prisma/prisma.service';
import { TelegramService } from '../telegram/telegram.service';
import { CreateCalculatorSubmissionDto } from './dto/create-calculator-submission.dto';
import { CreateContactSubmissionDto } from './dto/create-contact-submission.dto';
export declare class SubmissionsService {
    private prisma;
    private telegram;
    constructor(prisma: PrismaService, telegram: TelegramService);
    submitCalculator(data: CreateCalculatorSubmissionDto): Promise<{
        success: boolean;
        id: number;
    }>;
    submitContact(data: CreateContactSubmissionDto): Promise<{
        success: boolean;
        id: number;
    }>;
    findAll(): Promise<{
        projectType: string | null;
        designLevel: string | null;
        id: number;
        createdAt: Date;
        name: string;
        isMonthly: boolean | null;
        scopeModifiers: string | null;
        features: string | null;
        priceMin: number | null;
        priceMax: number | null;
        adBudget: string | null;
        email: string;
        phone: string | null;
        labels: string | null;
        message: string | null;
        solutions: string | null;
        serviceTypes: string | null;
        budget: string | null;
        source: string;
    }[]>;
    findOne(id: number): Promise<{
        projectType: string | null;
        designLevel: string | null;
        id: number;
        createdAt: Date;
        name: string;
        isMonthly: boolean | null;
        scopeModifiers: string | null;
        features: string | null;
        priceMin: number | null;
        priceMax: number | null;
        adBudget: string | null;
        email: string;
        phone: string | null;
        labels: string | null;
        message: string | null;
        solutions: string | null;
        serviceTypes: string | null;
        budget: string | null;
        source: string;
    } | null>;
    remove(id: number): Promise<{
        success: boolean;
    }>;
}
