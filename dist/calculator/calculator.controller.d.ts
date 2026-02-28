import { CalculatorService } from './calculator.service';
export declare class CalculatorController {
    private readonly calculatorService;
    constructor(calculatorService: CalculatorService);
    getConfig(): Promise<import("./calculator.service").CalculatorConfig>;
}
