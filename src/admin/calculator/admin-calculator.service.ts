import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminCalculatorService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  private async invalidateCache() {
    await this.cache.clear();
  }

  // ─── Full config for admin page ───

  async getFullConfig() {
    const [projectTypes, designLevels, featureCategories, features, scopeModifiers, scopeModifierOptions] =
      await Promise.all([
        this.prisma.projectType.findMany({ orderBy: { sortOrder: 'asc' } }),
        this.prisma.designLevel.findMany({ orderBy: { sortOrder: 'asc' } }),
        this.prisma.featureCategory.findMany({ orderBy: { sortOrder: 'asc' } }),
        this.prisma.feature.findMany({ orderBy: { sortOrder: 'asc' } }),
        this.prisma.scopeModifier.findMany({ orderBy: { sortOrder: 'asc' } }),
        this.prisma.scopeModifierOption.findMany({ orderBy: { sortOrder: 'asc' } }),
      ]);

    return { projectTypes, designLevels, featureCategories, features, scopeModifiers, scopeModifierOptions };
  }

  // ─── Project Types ───

  async updateProjectType(id: number, data: { basePriceMin?: number; basePriceMax?: number; isMonthly?: boolean; skipDesign?: boolean; sortOrder?: number }) {
    const result = this.prisma.projectType.update({ where: { id }, data });
    await this.invalidateCache();
    return result;
  }

  // ─── Design Levels ───

  async updateDesignLevel(id: number, data: { multiplier?: number; sortOrder?: number }) {
    const result = this.prisma.designLevel.update({ where: { id }, data });
    await this.invalidateCache();
    return result;
  }

  // ─── Feature Categories ───

  async addFeatureCategory(data: { projectTypeKey: string; categoryKey: string; sortOrder?: number }) {
    const result = await this.prisma.featureCategory.create({ data: { ...data, sortOrder: data.sortOrder ?? 0 } });
    await this.invalidateCache();
    return result;
  }

  async updateFeatureCategory(id: number, data: { categoryKey?: string; sortOrder?: number }) {
    const result = await this.prisma.featureCategory.update({ where: { id }, data });
    await this.invalidateCache();
    return result;
  }

  async deleteFeatureCategory(id: number) {
    await this.prisma.featureCategory.delete({ where: { id } });
    await this.invalidateCache();
    return { success: true };
  }

  // ─── Features ───

  async addFeature(data: { categoryId: number; key: string; priceMin: number; priceMax: number; recommended?: boolean; sortOrder?: number }) {
    const result = await this.prisma.feature.create({ data: { ...data, recommended: data.recommended ?? false, sortOrder: data.sortOrder ?? 0 } });
    await this.invalidateCache();
    return result;
  }

  async updateFeature(id: number, data: { key?: string; priceMin?: number; priceMax?: number; recommended?: boolean; sortOrder?: number }) {
    const result = await this.prisma.feature.update({ where: { id }, data });
    await this.invalidateCache();
    return result;
  }

  async deleteFeature(id: number) {
    await this.prisma.feature.delete({ where: { id } });
    await this.invalidateCache();
    return { success: true };
  }

  // ─── Scope Modifiers ───

  async addScopeModifier(data: { projectTypeKey: string; key: string; sortOrder?: number }) {
    const result = await this.prisma.scopeModifier.create({ data: { ...data, sortOrder: data.sortOrder ?? 0 } });
    await this.invalidateCache();
    return result;
  }

  async updateScopeModifier(id: number, data: { key?: string; sortOrder?: number }) {
    const result = await this.prisma.scopeModifier.update({ where: { id }, data });
    await this.invalidateCache();
    return result;
  }

  async deleteScopeModifier(id: number) {
    await this.prisma.scopeModifier.delete({ where: { id } });
    await this.invalidateCache();
    return { success: true };
  }

  // ─── Scope Modifier Options ───

  async addScopeModifierOption(data: { scopeModifierId: number; value: string; multiplier: number; sortOrder?: number }) {
    const result = await this.prisma.scopeModifierOption.create({ data: { ...data, sortOrder: data.sortOrder ?? 0 } });
    await this.invalidateCache();
    return result;
  }

  async updateScopeModifierOption(id: number, data: { value?: string; multiplier?: number; sortOrder?: number }) {
    const result = await this.prisma.scopeModifierOption.update({ where: { id }, data });
    await this.invalidateCache();
    return result;
  }

  async deleteScopeModifierOption(id: number) {
    await this.prisma.scopeModifierOption.delete({ where: { id } });
    await this.invalidateCache();
    return { success: true };
  }
}
