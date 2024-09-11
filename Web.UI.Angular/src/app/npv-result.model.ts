export class NpvResult {
  cashFlow: number;
  discountRate: number;
  npv: number;

  constructor(cashFlow:number, discountRate: number, npv: number) {
    this.cashFlow = cashFlow;
    this.discountRate = discountRate;
    this.npv = npv;
  }
}
