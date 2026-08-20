export interface OrderItem {
  itemId: string;
  itemName: string;
  type: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  orderId: string;
  customerName: string;
  items: OrderItem[];
  totalPrice: number;
  paymentStatus: string;
  stripeSessionId?: string;
  paymentIntentId?: string;
  createdAt: Date;
}
