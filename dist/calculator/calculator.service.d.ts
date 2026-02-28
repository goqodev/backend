import { PrismaService } from '../prisma/prisma.service';
export interface CalculatorConfig {
    projectTypeKeys: string[];
    monthlyTypes: string[];
    skipDesignTypes: string[];
    basePrices: Record<string, [number, number]>;
    designMultipliers: Record<string, number>;
    designLevelKeys: string[];
    categorizedFeatures: Record<string, Array<{
        categoryKey: string;
        features: Array<{
            key: string;
            price: [number, number];
            recommended?: boolean;
        }>;
    }>>;
    scopeModifiers: Record<string, Array<{
        key: string;
        options: Array<{
            value: string;
            multiplier: number;
        }>;
    }>>;
}
export declare class CalculatorService {
    private prisma;
    constructor(prisma: PrismaService);
    getConfig(): Promise<CalculatorConfig>;
}
