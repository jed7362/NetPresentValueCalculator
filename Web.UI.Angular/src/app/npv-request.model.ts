export class NpvRequest {
    cashFlows: number[];
    lowerRate: number;
    upperRate: number;
    rateIncrement: number;
  
    constructor(cashFlows: number[], lowerRate: number, upperRate: number, rateIncrement: number) {
      this.cashFlows = cashFlows;
      this.lowerRate = lowerRate;
      this.upperRate = upperRate;
      this.rateIncrement = rateIncrement;
    }
  }
  