import { AdminCalculatorService } from './admin-calculator.service';
export declare class AdminCalculatorController {
    private readonly service;
    constructor(service: AdminCalculatorService);
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
    updateProjectType(id: number, body: {
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
    updateDesignLevel(id: number, body: {
        multiplier?: number;
        sortOrder?: number;
    }): Promise<{
        id: number;
        sortOrder: number;
        key: string;
        multiplier: number;
    }>;
    addFeatureCategory(body: {
        projectTypeKey: string;
        categoryKey: string;
        sortOrder?: number;
    }): Promise<{
        id: number;
        sortOrder: number;
        projectTypeKey: string;
        categoryKey: string;
    }>;
    updateFeatureCategory(id: number, body: {
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
    addFeature(body: {
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
    updateFeature(id: number, body: {
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
    addScopeModifier(body: {
        projectTypeKey: string;
        key: string;
        sortOrder?: number;
    }): Promise<{
        id: number;
        sortOrder: number;
        key: string;
        projectTypeKey: string;
    }>;
    updateScopeModifier(id: number, body: {
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
    addScopeModifierOption(body: {
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
    updateScopeModifierOption(id: number, body: {
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
