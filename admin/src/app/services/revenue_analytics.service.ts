import { Injectable } from '@angular/core';
import { Order } from '../model/order.model';

@Injectable({
  providedIn: 'root',
})
export class RevenueAnalyticsService {
  calculateThisYearRevenue(orderList: Order[]) {
    const now = new Date();
    const currentYear = now.getFullYear();

    //set start of the timelines
    const startOfTheYear = new Date(currentYear, 0, 1);
    const currentQuaterMonth = Math.floor(now.getMonth() / 3) * 3;
    const startOfTheQuater = new Date(currentYear, currentQuaterMonth, 1);
    const StartOfTheMonth = new Date(currentYear, now.getMonth(), 1);

    const startOfTheWeek = new Date(now);
    startOfTheWeek.setDate(now.getDate() - now.getDay());
    startOfTheWeek.setHours(0, 0, 0, 0);

    const metrics = {
      class: { week: 0, month: 0, quater: 0, year: 0, allTime: 0 },
      product: { week: 0, month: 0, quater: 0, year: 0, allTime: 0 },
      overall: { week: 0, month: 0, quater: 0, year: 0, allTime: 0 },
    };
    // 3. Single-pass aggregation loop
    orderList.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const price = order.totalPrice || 0;
      const category =
        order.type === 'Class' ? 'class' : order.type === 'Product' ? 'product' : null;

      if (!category) return;

      // Add to category all-time
      metrics[category].allTime += price;
      metrics.overall.allTime += price;

      // Check time periods and add to both category and overall totals
      if (orderDate >= startOfTheWeek) {
        metrics[category].week += price;
        metrics.overall.week += price;
      }
      if (orderDate >= StartOfTheMonth) {
        metrics[category].month += price;
        metrics.overall.month += price;
      }
      if (orderDate >= startOfTheQuater) {
        metrics[category].quater += price;
        metrics.overall.quater += price;
      }
      if (orderDate >= startOfTheYear) {
        metrics[category].year += price;
        metrics.overall.year += price;
      }
    });
    console.log('Revenue metrics calculated:', metrics);
    return metrics;
  }
}
