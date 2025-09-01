import { Request, Response } from 'express';
import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';
import { asyncHandler, createError } from '../middleware/errorHandler.js';
import { AddToCartRequest, UpdateCartItemRequest } from '../types/index.js';
import logger from '../utils/logger.js';
import mongoose from 'mongoose';

/**
 * Get user's cart
 * GET /api/cart
 */
export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  let cart = await Cart.findOne({ userId }).populate('items.productId', 'title price images stock');

  if (!cart) {
    // Create empty cart if doesn't exist
    cart = await Cart.create({ userId, items: [] });
  }

  // Calculate totals
  const subtotal = cart.items.reduce((sum, item) => sum + item.priceSnapshot * item.qty, 0);

  res.json({
    ok: true,
    data: {
      cart: {
        id: cart._id,
        items: cart.items,
        subtotal,
        itemCount: cart.items.reduce((sum, item) => sum + item.qty, 0),
        updatedAt: cart.updatedAt,
      },
    },
  });
});

/**
 * Add item to cart
 * POST /api/cart
 */
export const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const { productId, qty = 1, variant }: AddToCartRequest = req.body;
  const userId = req.user?.id;

  // Validate product exists and is active
  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    throw createError('Product not found or inactive', 404);
  }

  if (product.stock < qty) {
    throw createError('Insufficient stock', 400);
  }

  // Find or create cart
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }

  // Check if item with same variant already exists
  const variantKey = JSON.stringify(variant || {});
  const existingItemIndex = cart.items.findIndex(
    item => item.productId.toString() === productId && 
            JSON.stringify(item.variant || {}) === variantKey
  );

  if (existingItemIndex >= 0) {
    // Update existing item quantity
    const newQty = cart.items[existingItemIndex].qty + qty;
    if (product.stock < newQty) {
      throw createError('Insufficient stock for requested quantity', 400);
    }
    cart.items[existingItemIndex].qty = newQty;
  } else {
    // Add new item
    cart.items.push({
      _id: new mongoose.Types.ObjectId(),
      productId: product._id,
      title: product.title,
      priceSnapshot: product.price,
      variant,
      qty,
    });
  }

  await cart.save();

  logger.info(`Item added to cart: ${product.title} by ${req.user?.email}`);

  res.json({
    ok: true,
    message: 'Item added to cart',
    data: { cartId: cart._id },
  });
});

/**
 * Update cart item quantity
 * PATCH /api/cart/:itemId
 */
export const updateCartItem = asyncHandler(async (req: Request, res: Response) => {
  const { itemId } = req.params;
  const { qty }: UpdateCartItemRequest = req.body;
  const userId = req.user?.id;

  if (qty < 1) {
    throw createError('Quantity must be at least 1', 400);
  }

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw createError('Cart not found', 404);
  }

  const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
  if (itemIndex === -1) {
    throw createError('Cart item not found', 404);
  }

  // Validate stock availability
  const product = await Product.findById(cart.items[itemIndex].productId);
  if (!product || product.stock < qty) {
    throw createError('Insufficient stock', 400);
  }

  cart.items[itemIndex].qty = qty;
  await cart.save();

  res.json({
    ok: true,
    message: 'Cart item updated',
  });
});

/**
 * Remove item from cart
 * DELETE /api/cart/:itemId
 */
export const removeFromCart = asyncHandler(async (req: Request, res: Response) => {
  const { itemId } = req.params;
  const userId = req.user?.id;

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw createError('Cart not found', 404);
  }

  const initialLength = cart.items.length;
  cart.items = cart.items.filter(item => item._id.toString() !== itemId);

  if (cart.items.length === initialLength) {
    throw createError('Cart item not found', 404);
  }

  await cart.save();

  res.json({
    ok: true,
    message: 'Item removed from cart',
  });
});