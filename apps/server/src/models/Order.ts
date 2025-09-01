import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  title: string;
  priceAtPurchase: number;
  qty: number;
  variant?: Record<string, string>;
}

export interface IShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  orderNumber: string;
  userId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  subtotal: number;
  discountTotal: number;
  grandTotal: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress?: IShippingAddress;
  paymentRef?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  priceAtPurchase: {
    type: Number,
    required: true,
    min: 0,
  },
  qty: {
    type: Number,
    required: true,
    min: 1,
  },
  variant: {
    type: Schema.Types.Mixed,
    default: {},
  },
});

const shippingAddressSchema = new Schema<IShippingAddress>({
  name: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, required: true, default: 'US' },
});

const orderSchema = new Schema<IOrder>({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
  discountTotal: {
    type: Number,
    default: 0,
    min: 0,
  },
  grandTotal: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  shippingAddress: shippingAddressSchema,
  paymentRef: String,
}, {
  timestamps: true,
});

// Indexes for performance
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.orderNumber = `ORD-${timestamp}-${random}`.toUpperCase();
  }
  next();
});

export const Order = mongoose.model<IOrder>('Order', orderSchema);