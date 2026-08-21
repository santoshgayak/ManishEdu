import { Injectable } from '@angular/core';
import { Order } from '../model/order.model';

@Injectable({
  providedIn: 'root',
})
export class RevenueAnalyticsService {
  calculateThisYearRevenue(orderList: Order[]) {
    const now = new Date();
    const currentYear = now.getFullYear();

    // Start of the year
    const startOfTheYear = new Date(currentYear, 0, 1);

    // Start of the current quarter
    const currentQuarterMonth = Math.floor(now.getMonth() / 3) * 3;
    const startOfTheQuarter = new Date(currentYear, currentQuarterMonth, 1);

    // Start of the current month
    const startOfTheMonth = new Date(currentYear, now.getMonth(), 1);

    // Start of the current week
    const startOfTheWeek = new Date(now);
    startOfTheWeek.setDate(now.getDate() - now.getDay());
    startOfTheWeek.setHours(0, 0, 0, 0);

    const metrics = {
      class: {
        week: 0,
        month: 0,
        quater: 0,
        year: 0,
        allTime: 0,
      },

      product: {
        week: 0,
        month: 0,
        quater: 0,
        year: 0,
        allTime: 0,
      },

      overall: {
        week: 0,
        month: 0,
        quater: 0,
        year: 0,
        allTime: 0,
      },
    };

    // Go through every order
    orderList.forEach((order) => {
      // Only count successful payments
      if (order.paymentStatus !== 'Paid') {
        return;
      }

      const orderDate = new Date(order.createdAt);

      // Determine order category
      const category =
        order.type === 'Class' ? 'class' : order.type === 'Product' ? 'product' : null;

      if (!category) {
        return;
      }

      // Calculate total price of ALL items in this order
      const price = order.items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

      // -------------------------
      // ALL TIME
      // -------------------------
      metrics[category].allTime += price;
      metrics.overall.allTime += price;

      // -------------------------
      // THIS WEEK
      // -------------------------
      if (orderDate >= startOfTheWeek) {
        metrics[category].week += price;
        metrics.overall.week += price;
      }

      // -------------------------
      // THIS MONTH
      // -------------------------
      if (orderDate >= startOfTheMonth) {
        metrics[category].month += price;
        metrics.overall.month += price;
      }

      // -------------------------
      // THIS QUARTER
      // -------------------------
      if (orderDate >= startOfTheQuarter) {
        metrics[category].quater += price;
        metrics.overall.quater += price;
      }

      // -------------------------
      // THIS YEAR
      // -------------------------
      if (orderDate >= startOfTheYear) {
        metrics[category].year += price;
        metrics.overall.year += price;
      }
    });

    console.log('Revenue metrics calculated:', metrics);

    return metrics;
  }
}
