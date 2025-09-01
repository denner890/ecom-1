import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItem {
  _id: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  title: string;
  priceSnapshot: number;
  variant?: Record<string, string>;
  qty: number;
}

export interface ICart extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  items: ICartItem[];
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  priceSnapshot: {
    type: Number,
    required: true,
    min: 0,
  },
  variant: {
    type: Schema.Types.Mixed,
    default: {},
  },
  qty: {
    type: Number,
    required: true,
    min: 1,
  },
});

const cartSchema = new Schema<ICart>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  items: [cartItemSchema],
}, {
  timestamps: { createdAt: false, updatedAt: true },
});

// Index for performance
cartSchema.index({ userId: 1 });

export const Cart = mongoose.model<ICart>('Cart', cartSchema);