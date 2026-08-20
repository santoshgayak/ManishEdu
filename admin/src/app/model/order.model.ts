import { OrderType } from './order-type.model';
import { PaymentStatus } from './payment-status.model';

export interface Order {
  _id?: string;
  orderId: string;
  customerName: string;
  customerEmail?: string;
  type: OrderType;
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  paymentStatus: PaymentStatus;
  createdAt: string | Date;
}
