import { Module } from '@nestjs/common';
import { AdminCalculatorService } from './admin-calculator.service';
import { AdminCalculatorController } from './admin-calculator.controller';

@Module({
  controllers: [AdminCalculatorController],
  providers: [AdminCalculatorService],
})
export class AdminCalculatorModule {}
