import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { CalculatorService } from './calculator.service';

@Controller('calculator')
@UseInterceptors(CacheInterceptor)
export class CalculatorController {
  constructor(private readonly calculatorService: CalculatorService) {}

  @Get('config')
  @CacheTTL(300000) // 5 min — config changes rarely
  getConfig() {
    return this.calculatorService.getConfig();
  }
}
