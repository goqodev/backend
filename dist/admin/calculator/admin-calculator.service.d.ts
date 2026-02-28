import { Cache } from '@nestjs/cache-manager';
import { PrismaService } from '../../prisma/prisma.service';
export declare class AdminCalculatorService {
    private prisma;
    private cache;
    constructor(prisma: PrismaService, cache: Cache);
    private invalidateCache;
    getFullConfig(): Promise<{
        projectTypes: {
            id: number;
            sortOrder: number;
            key: string;
            basePriceMin: number;
            basePriceMax: number;
            isMonthly: boolean;
            skipDesign: boolean;
        }[];
        designLevels: {
            id: number;
            sortOrder: number;
            key: string;
            multiplier: number;
        }[];
        featureCategories: {
            id: number;
            sortOrder: number;
            projectTypeKey: string;
            categoryKey: string;
        }[];
        features: {
            id: number;
            sortOrder: number;
            key: string;
            categoryId: number;
            priceMin: number;
            priceMax: number;
            recommended: boolean;
        }[];
        scopeModifiers: {
            id: number;
            sortOrder: number;
            key: string;
            projectTypeKey: string;
        }[];
        scopeModifierOptions: {
            id: number;
            sortOrder: number;
            multiplier: number;
            scopeModifierId: number;
            value: string;
        }[];
    }>;
    updateProjectType(id: number, data: {
        basePriceMin?: number;
        basePriceMax?: number;
        isMonthly?: boolean;
        skipDesign?: boolean;
        sortOrder?: number;
    }): Promise<{
        id: number;
        sortOrder: number;
        key: string;
        basePriceMin: number;
        basePriceMax: number;
        isMonthly: boolean;
        skipDesign: boolean;
    }>;
    updateDesignLevel(id: number, data: {
        multiplier?: number;
        sortOrder?: number;
    }): Promise<{
        id: number;
        sortOrder: number;
        key: string;
        multiplier: number;
    }>;
    addFeatureCategory(data: {
        projectTypeKey: string;
        categoryKey: string;
        sortOrder?: number;
    }): Promise<{
        id: number;
        sortOrder: number;
        projectTypeKey: string;
        categoryKey: string;
    }>;
    updateFeatureCategory(id: number, data: {
        categoryKey?: string;
        sortOrder?: number;
    }): Promise<{
        id: number;
        sortOrder: number;
        projectTypeKey: string;
        categoryKey: string;
    }>;
    deleteFeatureCategory(id: number): Promise<{
        success: boolean;
    }>;
    addFeature(data: {
        categoryId: number;
        key: string;
        priceMin: number;
        priceMax: number;
        recommended?: boolean;
        sortOrder?: number;
    }): Promise<{
        id: number;
        sortOrder: number;
        key: string;
        categoryId: number;
        priceMin: number;
        priceMax: number;
        recommended: boolean;
    }>;
    updateFeature(id: number, data: {
        key?: string;
        priceMin?: number;
        priceMax?: number;
        recommended?: boolean;
        sortOrder?: number;
    }): Promise<{
        id: number;
        sortOrder: number;
        key: string;
        categoryId: number;
        priceMin: number;
        priceMax: number;
        recommended: boolean;
    }>;
    deleteFeature(id: number): Promise<{
        success: boolean;
    }>;
    addScopeModifier(data: {
        projectTypeKey: string;
        key: string;
        sortOrder?: number;
    }): Promise<{
        id: number;
        sortOrder: number;
        key: string;
        projectTypeKey: string;
    }>;
    updateScopeModifier(id: number, data: {
        key?: string;
        sortOrder?: number;
    }): Promise<{
        id: number;
        sortOrder: number;
        key: string;
        projectTypeKey: string;
    }>;
    deleteScopeModifier(id: number): Promise<{
        success: boolean;
    }>;
    addScopeModifierOption(data: {
        scopeModifierId: number;
        value: string;
        multiplier: number;
        sortOrder?: number;
    }): Promise<{
        id: number;
        sortOrder: number;
        multiplier: number;
        scopeModifierId: number;
        value: string;
    }>;
    updateScopeModifierOption(id: number, data: {
        value?: string;
        multiplier?: number;
        sortOrder?: number;
    }): Promise<{
        id: number;
        sortOrder: number;
        multiplier: number;
        scopeModifierId: number;
        value: string;
    }>;
    deleteScopeModifierOption(id: number): Promise<{
        success: boolean;
    }>;
}
