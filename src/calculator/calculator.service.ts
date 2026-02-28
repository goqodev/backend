import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CalculatorConfig {
  projectTypeKeys: string[];
  monthlyTypes: string[];
  skipDesignTypes: string[];
  basePrices: Record<string, [number, number]>;
  designMultipliers: Record<string, number>;
  designLevelKeys: string[];
  categorizedFeatures: Record<
    string,
    Array<{
      categoryKey: string;
      features: Array<{
        key: string;
        price: [number, number];
        recommended?: boolean;
      }>;
    }>
  >;
  scopeModifiers: Record<
    string,
    Array<{
      key: string;
      options: Array<{ value: string; multiplier: number }>;
    }>
  >;
}

@Injectable()
export class CalculatorService {
  constructor(private prisma: PrismaService) {}

  async getConfig(): Promise<CalculatorConfig> {
    const [ptRows, dlRows, fcRows, fRows, smRows, smoRows] =
      await Promise.all([
        this.prisma.projectType.findMany({ orderBy: { sortOrder: 'asc' } }),
        this.prisma.designLevel.findMany({ orderBy: { sortOrder: 'asc' } }),
        this.prisma.featureCategory.findMany({ orderBy: { sortOrder: 'asc' } }),
        this.prisma.feature.findMany({ orderBy: { sortOrder: 'asc' } }),
        this.prisma.scopeModifier.findMany({ orderBy: { sortOrder: 'asc' } }),
        this.prisma.scopeModifierOption.findMany({
          orderBy: { sortOrder: 'asc' },
        }),
      ]);

    // Project types
    const projectTypeKeys: string[] = [];
    const monthlyTypes: string[] = [];
    const skipDesignTypes: string[] = [];
    const basePrices: Record<string, [number, number]> = {};

    for (const pt of ptRows) {
      projectTypeKeys.push(pt.key);
      basePrices[pt.key] = [pt.basePriceMin, pt.basePriceMax];
      if (pt.isMonthly) monthlyTypes.push(pt.key);
      if (pt.skipDesign) skipDesignTypes.push(pt.key);
    }

    // Design levels
    const designLevelKeys: string[] = [];
    const designMultipliers: Record<string, number> = {};

    for (const dl of dlRows) {
      designLevelKeys.push(dl.key);
      designMultipliers[dl.key] = dl.multiplier;
    }

    // Feature categories + features
    const categorizedFeatures: CalculatorConfig['categorizedFeatures'] = {};

    const featuresByCategory = new Map<number, typeof fRows>();
    for (const f of fRows) {
      if (!featuresByCategory.has(f.categoryId))
        featuresByCategory.set(f.categoryId, []);
      featuresByCategory.get(f.categoryId)!.push(f);
    }

    for (const fc of fcRows) {
      if (!categorizedFeatures[fc.projectTypeKey]) {
        categorizedFeatures[fc.projectTypeKey] = [];
      }
      const catFeatures = (featuresByCategory.get(fc.id) || []).map((f) => ({
        key: f.key,
        price: [f.priceMin, f.priceMax] as [number, number],
        ...(f.recommended ? { recommended: true } : {}),
      }));
      categorizedFeatures[fc.projectTypeKey].push({
        categoryKey: fc.categoryKey,
        features: catFeatures,
      });
    }

    // Scope modifiers + options
    const scopeMods: CalculatorConfig['scopeModifiers'] = {};

    const optionsByModifier = new Map<number, typeof smoRows>();
    for (const opt of smoRows) {
      if (!optionsByModifier.has(opt.scopeModifierId))
        optionsByModifier.set(opt.scopeModifierId, []);
      optionsByModifier.get(opt.scopeModifierId)!.push(opt);
    }

    for (const sm of smRows) {
      if (!scopeMods[sm.projectTypeKey]) {
        scopeMods[sm.projectTypeKey] = [];
      }
      const opts = (optionsByModifier.get(sm.id) || []).map((o) => ({
        value: o.value,
        multiplier: o.multiplier,
      }));
      scopeMods[sm.projectTypeKey].push({ key: sm.key, options: opts });
    }

    return {
      projectTypeKeys,
      monthlyTypes,
      skipDesignTypes,
      basePrices,
      designMultipliers,
      designLevelKeys,
      categorizedFeatures,
      scopeModifiers: scopeMods,
    };
  }
}
