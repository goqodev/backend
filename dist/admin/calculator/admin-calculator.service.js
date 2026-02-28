"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminCalculatorService = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const prisma_service_1 = require("../../prisma/prisma.service");
let AdminCalculatorService = class AdminCalculatorService {
    constructor(prisma, cache) {
        this.prisma = prisma;
        this.cache = cache;
    }
    async invalidateCache() {
        await this.cache.clear();
    }
    async getFullConfig() {
        const [projectTypes, designLevels, featureCategories, features, scopeModifiers, scopeModifierOptions] = await Promise.all([
            this.prisma.projectType.findMany({ orderBy: { sortOrder: 'asc' } }),
            this.prisma.designLevel.findMany({ orderBy: { sortOrder: 'asc' } }),
            this.prisma.featureCategory.findMany({ orderBy: { sortOrder: 'asc' } }),
            this.prisma.feature.findMany({ orderBy: { sortOrder: 'asc' } }),
            this.prisma.scopeModifier.findMany({ orderBy: { sortOrder: 'asc' } }),
            this.prisma.scopeModifierOption.findMany({ orderBy: { sortOrder: 'asc' } }),
        ]);
        return { projectTypes, designLevels, featureCategories, features, scopeModifiers, scopeModifierOptions };
    }
    async updateProjectType(id, data) {
        const result = this.prisma.projectType.update({ where: { id }, data });
        await this.invalidateCache();
        return result;
    }
    async updateDesignLevel(id, data) {
        const result = this.prisma.designLevel.update({ where: { id }, data });
        await this.invalidateCache();
        return result;
    }
    async addFeatureCategory(data) {
        const result = await this.prisma.featureCategory.create({ data: { ...data, sortOrder: data.sortOrder ?? 0 } });
        await this.invalidateCache();
        return result;
    }
    async updateFeatureCategory(id, data) {
        const result = await this.prisma.featureCategory.update({ where: { id }, data });
        await this.invalidateCache();
        return result;
    }
    async deleteFeatureCategory(id) {
        await this.prisma.featureCategory.delete({ where: { id } });
        await this.invalidateCache();
        return { success: true };
    }
    async addFeature(data) {
        const result = await this.prisma.feature.create({ data: { ...data, recommended: data.recommended ?? false, sortOrder: data.sortOrder ?? 0 } });
        await this.invalidateCache();
        return result;
    }
    async updateFeature(id, data) {
        const result = await this.prisma.feature.update({ where: { id }, data });
        await this.invalidateCache();
        return result;
    }
    async deleteFeature(id) {
        await this.prisma.feature.delete({ where: { id } });
        await this.invalidateCache();
        return { success: true };
    }
    async addScopeModifier(data) {
        const result = await this.prisma.scopeModifier.create({ data: { ...data, sortOrder: data.sortOrder ?? 0 } });
        await this.invalidateCache();
        return result;
    }
    async updateScopeModifier(id, data) {
        const result = await this.prisma.scopeModifier.update({ where: { id }, data });
        await this.invalidateCache();
        return result;
    }
    async deleteScopeModifier(id) {
        await this.prisma.scopeModifier.delete({ where: { id } });
        await this.invalidateCache();
        return { success: true };
    }
    async addScopeModifierOption(data) {
        const result = await this.prisma.scopeModifierOption.create({ data: { ...data, sortOrder: data.sortOrder ?? 0 } });
        await this.invalidateCache();
        return result;
    }
    async updateScopeModifierOption(id, data) {
        const result = await this.prisma.scopeModifierOption.update({ where: { id }, data });
        await this.invalidateCache();
        return result;
    }
    async deleteScopeModifierOption(id) {
        await this.prisma.scopeModifierOption.delete({ where: { id } });
        await this.invalidateCache();
        return { success: true };
    }
};
exports.AdminCalculatorService = AdminCalculatorService;
exports.AdminCalculatorService = AdminCalculatorService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_manager_1.Cache])
], AdminCalculatorService);
//# sourceMappingURL=admin-calculator.service.js.map