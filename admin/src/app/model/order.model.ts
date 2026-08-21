import { OrderType } from './order-type.model';
import { PaymentStatus } from './payment-status.model';

export interface OrderItem {
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  _id?: string;
  orderId: string;
  customerName?: string;
  customerEmail?: string;
  customerId?: string;
  type: OrderType;
  items: OrderItem[];
  totalPrice: number;
  paymentStatus: PaymentStatus;
  stripeSessionId?: string;
  createdAt: string | Date;
  paidAt?: string | Date;
}
