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
exports.AdminCalculatorController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../../auth/auth.guard");
const admin_calculator_service_1 = require("./admin-calculator.service");
let AdminCalculatorController = class AdminCalculatorController {
    constructor(service) {
        this.service = service;
    }
    getFullConfig() {
        return this.service.getFullConfig();
    }
    updateProjectType(id, body) {
        return this.service.updateProjectType(id, body);
    }
    updateDesignLevel(id, body) {
        return this.service.updateDesignLevel(id, body);
    }
    addFeatureCategory(body) {
        return this.service.addFeatureCategory(body);
    }
    updateFeatureCategory(id, body) {
        return this.service.updateFeatureCategory(id, body);
    }
    deleteFeatureCategory(id) {
        return this.service.deleteFeatureCategory(id);
    }
    addFeature(body) {
        return this.service.addFeature(body);
    }
    updateFeature(id, body) {
        return this.service.updateFeature(id, body);
    }
    deleteFeature(id) {
        return this.service.deleteFeature(id);
    }
    addScopeModifier(body) {
        return this.service.addScopeModifier(body);
    }
    updateScopeModifier(id, body) {
        return this.service.updateScopeModifier(id, body);
    }
    deleteScopeModifier(id) {
        return this.service.deleteScopeModifier(id);
    }
    addScopeModifierOption(body) {
        return this.service.addScopeModifierOption(body);
    }
    updateScopeModifierOption(id, body) {
        return this.service.updateScopeModifierOption(id, body);
    }
    deleteScopeModifierOption(id) {
        return this.service.deleteScopeModifierOption(id);
    }
};
exports.AdminCalculatorController = AdminCalculatorController;
__decorate([
    (0, common_1.Get)('config'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminCalculatorController.prototype, "getFullConfig", null);
__decorate([
    (0, common_1.Put)('project-types/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], AdminCalculatorController.prototype, "updateProjectType", null);
__decorate([
    (0, common_1.Put)('design-levels/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], AdminCalculatorController.prototype, "updateDesignLevel", null);
__decorate([
    (0, common_1.Post)('feature-categories'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminCalculatorController.prototype, "addFeatureCategory", null);
__decorate([
    (0, common_1.Put)('feature-categories/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], AdminCalculatorController.prototype, "updateFeatureCategory", null);
__decorate([
    (0, common_1.Delete)('feature-categories/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdminCalculatorController.prototype, "deleteFeatureCategory", null);
__decorate([
    (0, common_1.Post)('features'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminCalculatorController.prototype, "addFeature", null);
__decorate([
    (0, common_1.Put)('features/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], AdminCalculatorController.prototype, "updateFeature", null);
__decorate([
    (0, common_1.Delete)('features/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdminCalculatorController.prototype, "deleteFeature", null);
__decorate([
    (0, common_1.Post)('scope-modifiers'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminCalculatorController.prototype, "addScopeModifier", null);
__decorate([
    (0, common_1.Put)('scope-modifiers/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], AdminCalculatorController.prototype, "updateScopeModifier", null);
__decorate([
    (0, common_1.Delete)('scope-modifiers/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdminCalculatorController.prototype, "deleteScopeModifier", null);
__decorate([
    (0, common_1.Post)('scope-modifier-options'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminCalculatorController.prototype, "addScopeModifierOption", null);
__decorate([
    (0, common_1.Put)('scope-modifier-options/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], AdminCalculatorController.prototype, "updateScopeModifierOption", null);
__decorate([
    (0, common_1.Delete)('scope-modifier-options/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdminCalculatorController.prototype, "deleteScopeModifierOption", null);
exports.AdminCalculatorController = AdminCalculatorController = __decorate([
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('admin/calculator'),
    __metadata("design:paramtypes", [admin_calculator_service_1.AdminCalculatorService])
], AdminCalculatorController);
//# sourceMappingURL=admin-calculator.controller.js.map