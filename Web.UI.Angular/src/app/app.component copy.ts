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
// export class AppComponent implements AfterViewInit {
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
//   public barChartDataSets: Array<{ data: [number], label: number }> = [];
//   public barChartYAxisLabels: Array<number> = [];

//   public barChartData: ChartConfiguration<'bar'>['data'] = {
//     labels: this.barChartYAxisLabels,
//     datasets: [
//       { data: [65, 59, 80, 81, 56, 55, 40], label: '100' }, //label cashflow
//       { data: [28, 48, 40, 19, 86, 27, 90], label: '200' },
//       { data: [28, 48, 40, 19, 86, 27, 900], label: '300' },
//     ],
//   };

//   public barChartOptions: ChartConfiguration<'bar'>['options'] = {
//     responsive: false,
//   };

//   updateChart() {
//     const ctx = document.getElementById('resultsChart') as HTMLCanvasElement;

//     if (!ctx) {
//       console.error('Canvas element with id "resultsChart" not found.');
//       return;
//     }

//     // Group data by cashFlow
//     const cashFlowGroups = this.npvResults.reduce((acc, result) => {
//       if (!acc[result.cashFlow]) {
//         acc[result.cashFlow] = { npvs: [] };
//       }
//       acc[result.cashFlow].npvs.push(result.npv);
//       return acc;
//     }, {} as { [key: number]: {  npvs: number[] } });

//     // Prepare chart data
//     const labels = Object.keys(cashFlowGroups);
//     console.log(cashFlowGroups);
    
//     this.barChartLabels = this.npvResults.map((x) => x.discountRate);
//     this.barChartYAxisLabels = this.npvResults.map((x) => x.discountRate);
//     // this.barChartDataSets =cashFlowGroups;

//     const discontRateLabel = this.npvResults.map((x) => x.discountRate);

//     const npvLabel = this.npvResults.map((x) => x.npv);

//     // Get existing chart instance if any
//     const existingChart = Chart.getChart(ctx);

//     // Destroy existing chart instance if it exists
//     if (existingChart) {
//       existingChart.destroy();
//     }

//     // Check if there's data to display
//     if (labels.length === 0) {
//       ctx.style.display = 'none'; // Hide the chart canvas
//       return;
//     } else {
//       ctx.style.display = 'block'; // Show the chart canvas
//     }

//     // Create new chart
//     new Chart(ctx, {
//       type: 'bar', // Ensure type is valid
//       data: {
//         labels: labels,
//         datasets: [
//           {
//             label: 'Discount Rate',
//             data: discontRateLabel,
//             backgroundColor: 'rgba(75, 192, 192, 0.2)',
//             borderColor: 'rgba(75, 192, 192, 1)',
//             borderWidth: 1,
//           },
//           {
//             label: 'NPV',
//             data: npvLabel,
//             backgroundColor: 'rgba(153, 102, 255, 0.2)',
//             borderColor: 'rgba(153, 102, 255, 1)',
//             borderWidth: 1,
//           },
//         ],
//       },
//       options: {
//         responsive: true,
//         scales: {
//           x: {
//             type: 'category',
//             title: {
//               display: true,
//               text: 'Cash Flow',
//             },
//             ticks: {
//               autoSkip: false,
//             },
//           },
//           y: {
//             type: 'linear',
//             title: {
//               display: true,
//               text: 'Value',
//             },
//           },
//         },
//       },
//     });
//   }

//   ngAfterViewInit() {
//     this.updateChart();
//   }

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
//       this.updateChart(); // Update chart when page changes
//     }
//   }

//   prevPage() {
//     if (this.currentPage > 1) {
//       this.currentPage--;
//       this.updateChart(); // Update chart when page changes
//     }
//   }

//   nextPage() {
//     if (this.currentPage < this.totalPages) {
//       this.currentPage++;
//       this.updateChart(); // Update chart when page changes
//     }
//   }
// }
