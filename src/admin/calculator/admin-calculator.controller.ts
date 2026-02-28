import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/auth.guard';
import { AdminCalculatorService } from './admin-calculator.service';

@UseGuards(JwtAuthGuard)
@Controller('admin/calculator')
export class AdminCalculatorController {
  constructor(private readonly service: AdminCalculatorService) {}

  @Get('config')
  getFullConfig() {
    return this.service.getFullConfig();
  }

  // ─── Project Types ───

  @Put('project-types/:id')
  updateProjectType(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { basePriceMin?: number; basePriceMax?: number; isMonthly?: boolean; skipDesign?: boolean; sortOrder?: number },
  ) {
    return this.service.updateProjectType(id, body);
  }

  // ─── Design Levels ───

  @Put('design-levels/:id')
  updateDesignLevel(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { multiplier?: number; sortOrder?: number },
  ) {
    return this.service.updateDesignLevel(id, body);
  }

  // ─── Feature Categories ───

  @Post('feature-categories')
  addFeatureCategory(
    @Body() body: { projectTypeKey: string; categoryKey: string; sortOrder?: number },
  ) {
    return this.service.addFeatureCategory(body);
  }

  @Put('feature-categories/:id')
  updateFeatureCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { categoryKey?: string; sortOrder?: number },
  ) {
    return this.service.updateFeatureCategory(id, body);
  }

  @Delete('feature-categories/:id')
  deleteFeatureCategory(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteFeatureCategory(id);
  }

  // ─── Features ───

  @Post('features')
  addFeature(
    @Body() body: { categoryId: number; key: string; priceMin: number; priceMax: number; recommended?: boolean; sortOrder?: number },
  ) {
    return this.service.addFeature(body);
  }

  @Put('features/:id')
  updateFeature(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { key?: string; priceMin?: number; priceMax?: number; recommended?: boolean; sortOrder?: number },
  ) {
    return this.service.updateFeature(id, body);
  }

  @Delete('features/:id')
  deleteFeature(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteFeature(id);
  }

  // ─── Scope Modifiers ───

  @Post('scope-modifiers')
  addScopeModifier(
    @Body() body: { projectTypeKey: string; key: string; sortOrder?: number },
  ) {
    return this.service.addScopeModifier(body);
  }

  @Put('scope-modifiers/:id')
  updateScopeModifier(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { key?: string; sortOrder?: number },
  ) {
    return this.service.updateScopeModifier(id, body);
  }

  @Delete('scope-modifiers/:id')
  deleteScopeModifier(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteScopeModifier(id);
  }

  // ─── Scope Modifier Options ───

  @Post('scope-modifier-options')
  addScopeModifierOption(
    @Body() body: { scopeModifierId: number; value: string; multiplier: number; sortOrder?: number },
  ) {
    return this.service.addScopeModifierOption(body);
  }

  @Put('scope-modifier-options/:id')
  updateScopeModifierOption(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { value?: string; multiplier?: number; sortOrder?: number },
  ) {
    return this.service.updateScopeModifierOption(id, body);
  }

  @Delete('scope-modifier-options/:id')
  deleteScopeModifierOption(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteScopeModifierOption(id);
  }
}
