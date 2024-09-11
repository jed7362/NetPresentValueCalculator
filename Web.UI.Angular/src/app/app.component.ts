import { Component, AfterViewInit } from '@angular/core';
import { NpvService } from './npv.service';
import { NpvRequest } from './npv-request.model';
import { NpvResult } from './npv-result.model';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  cashFlows = '';
  lowerRate = 0;
  upperRate = 0;
  rateIncrement: number = 0;
  npvResults: Array<NpvResult> = [];
  datasets: any[] = [];

  // Pagination Variables
  currentPage: number = 1;
  itemsPerPage: number = 5;

  constructor(private npvService: NpvService) {
    // Register Chart.js components
    Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  }

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],  // X-axis labels (discountRate)
    datasets: [], // Y-axis datasets (npv)
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Discount Rate %',
        },
        ticks: {
          autoSkip: false,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Net Present Value $',
        },
      },
    },
  };

  // Function to generate a random RGB color
  getRandomRgb(): string {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r}, ${g}, ${b})`;
  }

  prepareDatasets(): any[] {
    // Group data by cashFlow
    const cashFlowGroups = this.npvResults.reduce((acc, result) => {
      if (!acc[result.cashFlow]) {
        acc[result.cashFlow] = { discountRates: [], npvs: [] };
      }
      acc[result.cashFlow].discountRates.push(result.discountRate);
      acc[result.cashFlow].npvs.push(result.npv);
      return acc;
    }, {} as { [key: string]: { discountRates: number[]; npvs: number[] } });

    // Create datasets for each cashFlow group
    return Object.keys(cashFlowGroups).map((cashFlowKey) => {
      const backgroundColor = this.getRandomRgb();
      const borderColor = backgroundColor.replace('rgb', 'rgba').replace(')', ', 1)');

      return {
        label: `Cash Flow ${cashFlowKey}`, // Label for the dataset (cashFlow)
        data: cashFlowGroups[cashFlowKey].npvs, // Y-axis (npv values)
        backgroundColor: backgroundColor.replace(')', ', 0.2)'), // Background color with transparency
        borderColor: borderColor, // Solid color for border
        borderWidth: 1,
      };
    });
  }

  createChart() {
    const ctx = document.getElementById('resultsChart') as HTMLCanvasElement;

    if (!ctx) {
      console.error('Canvas element with id "resultsChart" not found.');
      return;
    }

    // Prepare datasets based on cashFlowGroups
    this.datasets = this.prepareDatasets();

    // Set discountRate values as X-axis labels (distinct values)
    const discountRateLabels = [
      ...new Set(this.npvResults.map(result => result.discountRate))
    ];

    this.barChartData.labels = discountRateLabels; // Set X-axis (discountRate)
    this.barChartData.datasets = this.datasets; // Set Y-axis (npv values)

    // Get existing chart instance if any
    const existingChart = Chart.getChart(ctx);

    // Destroy existing chart instance if it exists
    if (existingChart) {
      existingChart.destroy();
    }

    // Check if there's data to display
    if (discountRateLabels.length === 0) {
      ctx.style.display = 'none'; // Hide the chart canvas
      return;
    } else {
      ctx.style.display = 'block'; // Show the chart canvas
    }

    // Create new chart
    new Chart(ctx, {
      type: 'bar',
      data: this.barChartData,
      options: this.barChartOptions,
    });
  }

  ngAfterViewInit() {
    this.createChart();
  }

  calculateNPV() {
    const cashFlowArray = this.cashFlows.split(',').map(Number);
    const npvRequest = new NpvRequest(
      cashFlowArray,
      this.lowerRate,
      this.upperRate,
      this.rateIncrement
    );

    this.npvService.calculateNPV(npvRequest).subscribe(
      (response) => {
        this.npvResults = response.results.map(
          (result) =>
            new NpvResult(result.cashFlow, result.discountRate, result.npv)
        );

        this.createChart();
      },
      (error) => {
        console.error('Error fetching NPV data:', error);
      }
    );
  }

  // Pagination Functions
  get totalPages(): number {
    return Math.ceil(this.npvResults.length / this.itemsPerPage);
  }

  totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (v, k) => k + 1);
  }

  paginatedResults() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.npvResults.slice(start, end);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
}
