import mongoose, { Document, Schema } from 'mongoose';

export interface IVariant {
  name: string;
  values: string[];
}

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  images: string[];
  price: number;
  compareAtPrice?: number;
  discountPercent?: number;
  category: string;
  stock: number;
  variants: IVariant[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const variantSchema = new Schema<IVariant>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  values: [{
    type: String,
    required: true,
    trim: true,
  }],
});

const productSchema = new Schema<IProduct>({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  slug: {
    type: String,
    required: [true, 'Product slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'],
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  images: [{
    type: String,
    required: true,
  }],
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative'],
  },
  compareAtPrice: {
    type: Number,
    min: [0, 'Compare at price cannot be negative'],
    validate: {
      validator: function(this: IProduct, value: number) {
        return !value || value > this.price;
      },
      message: 'Compare at price must be greater than regular price',
    },
  },
  discountPercent: {
    type: Number,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%'],
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    trim: true,
  },
  stock: {
    type: Number,
    required: [true, 'Stock count is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0,
  },
  variants: [variantSchema],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes for performance
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

// Text search index
productSchema.index({
  title: 'text',
  description: 'text',
  category: 'text',
});

// Virtual for in stock status
productSchema.virtual('inStock').get(function() {
  return this.stock > 0;
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });

export const Product = mongoose.model<IProduct>('Product', productSchema);