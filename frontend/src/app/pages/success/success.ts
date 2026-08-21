import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Footer } from '../../components/footer/footer';
import jsPDF from 'jspdf';
import { CartService } from '../../services/cart/cart.service';
@Component({
  selector: 'app-success',
  standalone: true,
  imports: [CommonModule, Footer],
  templateUrl: './success.html',
  styleUrls: ['./success.css'],
})
export class Success implements OnInit {
  today = new Date();
  formatted = this.today.toLocaleDateString('en-GB');

  sessionId = '';
  orderId = '';
  paymentIntentId = '';
  paymentStatus = '';

  amount = '';
  currency = '';

  customerEmail = '';

  cardBrand = '';
  cardLast4 = '';

  chargeId = '';
  receiptUrl = '';

  tID = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    // Get session id from URL
    this.sessionId = this.route.snapshot.queryParamMap.get('session_id') || '';

    if (!this.sessionId) {
      console.error('❌ No session_id found in URL');
      return;
    }

    // Fetch Stripe session from backend
    this.http
      .get<any>(`https://manisheduserver.onrender.com/session-status?session_id=${this.sessionId}`)
      .subscribe({
        next: (res) => {
          console.log('✅ Session Data:', res);

          this.paymentStatus = res.paymentStatus;
          this.orderId = res.orderId;
          this.paymentIntentId = res.paymentIntentId;
          this.tID = this.paymentIntentId;
          this.amount = (res.amount / 100).toFixed(2);
          this.currency = res.currency;
          this.customerEmail = res.customerEmail;
          this.cardBrand = res.cardBrand;
          this.cardLast4 = res.cardLast4;
          this.chargeId = res.chargeId;
          this.receiptUrl = res.receiptUrl;
          this.cartService.clearCart();
          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error('❌ Error fetching session:', err);
        },
      });
  }

  downloadReceipt() {
    const pdf = new jsPDF('p', 'mm', 'a4');

    // HEADER
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.text('Manish Edu Shop', 105, 20, { align: 'center' });

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Official Payment Receipt', 105, 28, { align: 'center' });

    pdf.line(10, 35, 200, 35);

    let y = 50;

    // DETAILS
    pdf.text(`Transaction ID: ${this.paymentIntentId}`, 15, y);
    y += 10;
    pdf.text(`Order ID: ${this.orderId}`, 15, y);
    y += 10;

    pdf.text(`Date: ${this.formatted}`, 15, y);
    y += 10;

    pdf.text(`Email: ${this.customerEmail}`, 15, y);
    y += 10;

    pdf.text(`Status: ${this.paymentStatus}`, 15, y);
    y += 15;

    // PAYMENT BOX
    pdf.rect(10, y, 190, 30);

    pdf.text(`Amount Paid: ${this.amount} ${this.currency}`, 15, y + 10);
    pdf.text(`Card: ${this.cardBrand} **** ${this.cardLast4}`, 15, y + 20);

    y += 45;

    // FOOTER
    pdf.setFontSize(10);
    pdf.setTextColor(100);

    pdf.text('Thank you for your purchase. For support contact support@email.com', 105, 270, {
      align: 'center',
    });

    pdf.save(`receipt_${this.paymentIntentId}.pdf`);
  }
}
