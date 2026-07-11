import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import * as echarts from 'echarts';

import { DataService } from '../../services/data.service';
import { Order } from '../../model/order.model';
import { RevenueAnalyticsService } from '../../services/revenue_analytics.service';
import { ManageClasses } from "../../components/manage-classes/manage-classes";
import { ManageProducts } from "../../components/manage-products/manage-products";
@Component({
  selector: 'app-main-dashboard',
  standalone: true,
  imports: [DatePipe, RouterLink, ManageClasses, ManageProducts, NgClass],
  templateUrl: './main-dashboard.html',
  styleUrl: './main-dashboard.scss',
})
export class MainDashboard {

  private dataService = inject(DataService);
  private revenueAnalyticsService = inject(RevenueAnalyticsService);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private resizeObserver!: ResizeObserver;

  orderList: Order[] = [];

  total_revenue_period = 0;
  enrollment_total_period = 0;
  order_total_period = 0;

  //this year
  total_revenue_yearly = 0;
  enrollment_total_yearly = 0;
  order_total_yearly = 0;

  //this quater
  total_revenue_quater = 0;
  enrollment_total_quater = 0;
  order_total_quater = 0;

  //this month
  total_revenue_month = 0;
  enrollment_total_month = 0;
  order_total_month= 0;

  //this week
  total_revenue_week = 0;
  enrollment_total_week = 0;
  order_total_week = 0;

  private myChart!: echarts.ECharts;

  ngOnInit(): void {
    this.loadOrders();
  }

  ngAfterViewInit(): void {
    const chartDom = document.getElementById('donut-chart');

    if (chartDom) {
      this.myChart = echarts.init(chartDom);

      // Draw chart with initial values (0)
      this.updateChart(this.enrollment_total_week, this.order_total_week);
      this.cdr.detectChanges();
    }
  }

  private loadOrders(): void {
    this.dataService.getData('order', 'orders').subscribe({
      next: (res: any) => {

        this.orderList = res.data;
        // Calculate revenue metrics for different time periods
        const revenueMetrics = this.revenueAnalyticsService.calculateThisYearRevenue(this.orderList);
        console.log('Revenue Metrics:', revenueMetrics);

        // Assign calculated metrics to respective variables
        this.enrollment_total_week = revenueMetrics.class.week;
        this.order_total_week = revenueMetrics.product.week;
        this.total_revenue_week = revenueMetrics.overall.week;
      

        console.log('Weekly Metrics:', {
          enrollment_total_week: this.enrollment_total_week,
          order_total_week: this.order_total_week,
          total_revenue_week: this.total_revenue_week
        });

        this.enrollment_total_month = revenueMetrics.class.month;
        this.order_total_month = revenueMetrics.product.month;
        this.total_revenue_month = revenueMetrics.overall.month;
   


        console.log('Monthly Metrics:', {     
          enrollment_total_month: this.enrollment_total_month,
          order_total_month: this.order_total_month,
          total_revenue_month: this.total_revenue_month
        });

        this.enrollment_total_quater = revenueMetrics.class.quater;
        this.order_total_quater = revenueMetrics.product.quater;
        this.total_revenue_quater = revenueMetrics.overall.quater;
        this.enrollment_total_period = this.enrollment_total_quater;
        this.order_total_period = this.order_total_quater;
        this.total_revenue_period = this.total_revenue_quater;

        this.updateChart(
            this.enrollment_total_period,
            this.order_total_period
        );
    
        console.log('Quarterly Metrics:', {
          enrollment_total_quater: this.enrollment_total_quater,
          order_total_quater: this.order_total_quater,
          total_revenue_quater: this.total_revenue_quater
        });   

        this.enrollment_total_yearly = revenueMetrics.class.year;
        this.order_total_yearly = revenueMetrics.product.year;
        this.total_revenue_yearly = revenueMetrics.overall.year;
        console.log('Yearly Metrics:', {
          enrollment_total_yearly: this.enrollment_total_yearly,
          order_total_yearly: this.order_total_yearly,
          total_revenue_yearly: this.total_revenue_yearly
        }); 
        this.cdr.detectChanges();


        this.resizeObserver = new ResizeObserver(() => {
          if (this.myChart) {
            this.myChart.resize();
             // Refresh chart with new data
            this.updateChart(this.enrollment_total_quater, this.order_total_quater);
          }
        });

          this.resizeObserver.observe(this.myChart.getDom());

      },

      error: (err) => {
        console.error(err);
      }
    });
  }

  private updateChart(enrollmentValue: number, orderValue: number): void {

    if (!this.myChart) return;

    const option: echarts.EChartsOption = {
  color: ['#5470e6', '#b7dd32'],

  tooltip: {
    trigger: 'item',
    formatter: '{b}<br/>₹{c} ({d}%)'
  },

legend: {
  show:false
},


  series: [
    {
      name: 'Revenue',
      type: 'pie',
      radius: window.innerWidth < 768 ? ['40%', '70%'] : ['50%', '75%'],

      data: [
        {
          value: enrollmentValue,
          name: 'Enrollment Revenue'
        },
        {
          value: orderValue,
          name: 'Product Revenue'
        }
      ],

      itemStyle: {
        borderRadius: 8,
        borderColor: '#fff',
        borderWidth: 3
      },

      label: {
        show: true,
        formatter: '{b}\n{d}%'
      },

      labelLine: {
        show: true
      },

      emphasis: {
        scale: true,
        scaleSize: 8
      }
    }
  ]
};

    this.myChart.setOption(option, true);
  }

  onPeriodChange(event: Event): void {
    const selectedPeriod = (event.target as HTMLSelectElement).value;

    switch (selectedPeriod) {
      case 'week':
        this.enrollment_total_period = this.enrollment_total_week;
        this.order_total_period = this.order_total_week;
        this.total_revenue_period = this.total_revenue_week;
        break;
      case 'month':
        this.enrollment_total_period = this.enrollment_total_month;
        this.order_total_period = this.order_total_month;
        this.total_revenue_period = this.total_revenue_month;
        break;
      case 'quarter':
        this.enrollment_total_period = this.enrollment_total_quater;
        this.order_total_period = this.order_total_quater;
        this.total_revenue_period = this.total_revenue_quater;
        break;
      case 'year':
        this.enrollment_total_period = this.enrollment_total_yearly;
        this.order_total_period = this.order_total_yearly;
        this.total_revenue_period = this.total_revenue_yearly;
        break;
      default:
        console.warn('Unknown period selected:', selectedPeriod);
        break;
    }

    // Update the chart with the new values
    this.updateChart(this.enrollment_total_period, this.order_total_period);
  } 
}