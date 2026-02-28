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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculatorService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CalculatorService = class CalculatorService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getConfig() {
        const [ptRows, dlRows, fcRows, fRows, smRows, smoRows] = await Promise.all([
            this.prisma.projectType.findMany({ orderBy: { sortOrder: 'asc' } }),
            this.prisma.designLevel.findMany({ orderBy: { sortOrder: 'asc' } }),
            this.prisma.featureCategory.findMany({ orderBy: { sortOrder: 'asc' } }),
            this.prisma.feature.findMany({ orderBy: { sortOrder: 'asc' } }),
            this.prisma.scopeModifier.findMany({ orderBy: { sortOrder: 'asc' } }),
            this.prisma.scopeModifierOption.findMany({
                orderBy: { sortOrder: 'asc' },
            }),
        ]);
        const projectTypeKeys = [];
        const monthlyTypes = [];
        const skipDesignTypes = [];
        const basePrices = {};
        for (const pt of ptRows) {
            projectTypeKeys.push(pt.key);
            basePrices[pt.key] = [pt.basePriceMin, pt.basePriceMax];
            if (pt.isMonthly)
                monthlyTypes.push(pt.key);
            if (pt.skipDesign)
                skipDesignTypes.push(pt.key);
        }
        const designLevelKeys = [];
        const designMultipliers = {};
        for (const dl of dlRows) {
            designLevelKeys.push(dl.key);
            designMultipliers[dl.key] = dl.multiplier;
        }
        const categorizedFeatures = {};
        const featuresByCategory = new Map();
        for (const f of fRows) {
            if (!featuresByCategory.has(f.categoryId))
                featuresByCategory.set(f.categoryId, []);
            featuresByCategory.get(f.categoryId).push(f);
        }
        for (const fc of fcRows) {
            if (!categorizedFeatures[fc.projectTypeKey]) {
                categorizedFeatures[fc.projectTypeKey] = [];
            }
            const catFeatures = (featuresByCategory.get(fc.id) || []).map((f) => ({
                key: f.key,
                price: [f.priceMin, f.priceMax],
                ...(f.recommended ? { recommended: true } : {}),
            }));
            categorizedFeatures[fc.projectTypeKey].push({
                categoryKey: fc.categoryKey,
                features: catFeatures,
            });
        }
        const scopeMods = {};
        const optionsByModifier = new Map();
        for (const opt of smoRows) {
            if (!optionsByModifier.has(opt.scopeModifierId))
                optionsByModifier.set(opt.scopeModifierId, []);
            optionsByModifier.get(opt.scopeModifierId).push(opt);
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
};
exports.CalculatorService = CalculatorService;
exports.CalculatorService = CalculatorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CalculatorService);
//# sourceMappingURL=calculator.service.js.map