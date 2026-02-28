import { SubmissionsService } from './submissions.service';
import { CreateCalculatorSubmissionDto } from './dto/create-calculator-submission.dto';
import { CreateContactSubmissionDto } from './dto/create-contact-submission.dto';
export declare class SubmissionsController {
    private readonly submissionsService;
    constructor(submissionsService: SubmissionsService);
    submitCalculator(dto: CreateCalculatorSubmissionDto): Promise<{
        success: boolean;
        id: number;
    }>;
    submitContact(dto: CreateContactSubmissionDto): Promise<{
        success: boolean;
        id: number;
    }>;
    findOnePublic(id: number): Promise<{
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
