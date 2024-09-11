// import { Component, AfterViewInit } from '@angular/core';
// import { NpvService } from './npv.service';
// import { NpvRequest } from './npv-request.model';
// import { NpvResult } from './npv-result.model';
// import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartTypeRegistry,ChartConfiguration } from 'chart.js';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css'],
// })
// export class AppComponent {
//   cashFlows = '';
//   lowerRate = 0;
//   upperRate = 0;
//   rateIncrement: number = 0;
//   npvResults: Array<NpvResult> = [];

//   // Pagination Variables
//   currentPage: number = 1;
//   itemsPerPage: number = 5;

//   constructor(private npvService: NpvService) {
//     // Register Chart.js components
//     Chart.register(
//       CategoryScale,
//       LinearScale,
//       BarElement,
//       Title,
//       Tooltip,
//       Legend
//     );
//   }

//   public barChartLegend = true;
//   public barChartPlugins = [];

//   public barChartLabels: Array<number> = [];
//   public barChartDataSets: Array<any> = [];
//   public barChartYAxisLabels: Array<number> = [];

//   public barChartData: ChartConfiguration<'bar'>['data'] = {
//     labels: [],
//     datasets: [],
//   };

//   public barChartOptions: ChartConfiguration<'bar'>['options'] = {
//     responsive: false,
//   };

//   updateChart() {

//     // Group data by cashFlow
//     const cashFlowGroups = this.npvResults.reduce((acc, result) => {
//       if (!acc[result.cashFlow]) {
//         acc[result.cashFlow] = { discountRates: [], npvs: [] };
//       }
//       acc[result.cashFlow].discountRates.push(result.discountRate);
//       acc[result.cashFlow].npvs.push(result.npv);
//       return acc;
//     }, {} as { [key: string]: { discountRates: number[]; npvs: number[] } });

//     // Prepare chart data
//     const labels = Object.keys(cashFlowGroups);
//     console.log(cashFlowGroups);

//     this.barChartData.labels =Object.values(cashFlowGroups).map(x=>x.npvs);
//     console.log(this.barChartData.labels);
    
//     this.barChartData.datasets = Object.keys(cashFlowGroups).map((key) => ({
//       label: `CashFlow ${key}`,
//       data: cashFlowGroups[key].discountRates, // Use npv for dataset data
//     }));

//    }

//   calculateNPV() {
//     const cashFlowArray = this.cashFlows.split(',').map(Number);
//     const npvRequest = new NpvRequest(
//       cashFlowArray,
//       this.lowerRate,
//       this.upperRate,
//       this.rateIncrement
//     );

//     this.npvService.calculateNPV(npvRequest).subscribe(
//       (response) => {
//         this.npvResults = response.results.map(
//           (result) =>
//             new NpvResult(result.cashFlow, result.discountRate, result.npv)
//         );
//         this.updateChart();
//       },
//       (error) => {
//         console.error('Error fetching NPV data:', error);
//       }
//     );
//   }

//   // Pagination Functions
//   get totalPages(): number {
//     return Math.ceil(this.npvResults.length / this.itemsPerPage);
//   }

//   totalPagesArray(): number[] {
//     return Array.from({ length: this.totalPages }, (v, k) => k + 1);
//   }

//   paginatedResults() {
//     const start = (this.currentPage - 1) * this.itemsPerPage;
//     const end = start + this.itemsPerPage;
//     return this.npvResults.slice(start, end);
//   }

//   goToPage(page: number) {
//     if (page >= 1 && page <= this.totalPages) {
//       this.currentPage = page;
//     }
//   }

//   prevPage() {
//     if (this.currentPage > 1) {
//       this.currentPage--;
//     }
//   }

//   nextPage() {
//     if (this.currentPage < this.totalPages) {
//       this.currentPage++;
//     }
//   }
// }
