declare class FeatureLabel {
    name: string;
    priceMin: number;
    priceMax: number;
}
declare class ScopeModifierLabel {
    label: string;
    value: string;
}
declare class Labels {
    projectType: string;
    designLevel: string;
    scopeModifiers: ScopeModifierLabel[];
    features: FeatureLabel[];
    adBudget: string;
}
export declare class CreateCalculatorSubmissionDto {
    name: string;
    email: string;
    phone?: string;
    description?: string;
    projectType: string;
    designLevel?: string | null;
    features: string[];
    scopeModifiers: Record<string, string>;
    adBudget?: string | null;
    priceMin: number;
    priceMax: number;
    isMonthly: boolean;
    labels: Labels;
}
export {};
