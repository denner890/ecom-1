import { Request, Response } from 'express';
import { Order } from '../models/Order.js';
import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';
import { asyncHandler, createError } from '../middleware/errorHandler.js';
import { CreateOrderRequest, UpdateOrderStatusRequest } from '../types/index.js';
import logger from '../utils/logger.js';

/**
 * Create order from current cart
 * POST /api/orders
 */
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { shippingAddress, paymentRef }: CreateOrderRequest = req.body;
  const userId = req.user?.id;

  // Get user's cart
  const cart = await Cart.findOne({ userId }).populate('items.productId');
  if (!cart || cart.items.length === 0) {
    throw createError('Cart is empty', 400);
  }

  // Validate stock and calculate totals
  let subtotal = 0;
  const orderItems = [];

  for (const cartItem of cart.items) {
    const product = await Product.findById(cartItem.productId);
    if (!product || !product.isActive) {
      throw createError(`Product ${cartItem.title} is no longer available`, 400);
    }

    if (product.stock < cartItem.qty) {
      throw createError(`Insufficient stock for ${cartItem.title}`, 400);
    }

    const itemTotal = product.price * cartItem.qty;
    subtotal += itemTotal;

    orderItems.push({
      productId: product._id,
      title: product.title,
      priceAtPurchase: product.price,
      qty: cartItem.qty,
      variant: cartItem.variant,
    });

    // Update product stock
    product.stock -= cartItem.qty;
    await product.save();
  }

  // Calculate totals (simplified - no tax/shipping for now)
  const discountTotal = 0; // TODO: Apply discounts
  const grandTotal = subtotal - discountTotal;

  // Create order
  const order = await Order.create({
    userId,
    items: orderItems,
    subtotal,
    discountTotal,
    grandTotal,
    shippingAddress,
    paymentRef,
  });

  // Clear cart after successful order
  await Cart.findOneAndUpdate({ userId }, { items: [] });

  logger.info(`Order created: ${order.orderNumber} by ${req.user?.email}`);

  res.status(201).json({
    ok: true,
    message: 'Order created successfully',
    data: { order },
  });
});

/**
 * Get user's orders
 * GET /api/orders/my
 */
export const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
  } = req.query;

  const userId = req.user?.id;
  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(50, Math.max(1, Number(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [orders, total] = await Promise.all([
    Order.find({ userId })
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Order.countDocuments({ userId }),
  ]);

  const hasMore = skip + limitNum < total;

  res.json({
    ok: true,
    data: {
      items: orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        hasMore,
      },
    },
  });
});

/**
 * Get all orders (Admin only)
 * GET /api/orders
 */
export const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 20,
    status,
  } = req.query;

  const filter: any = {};
  if (status) filter.status = status;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum)
      .populate('userId', 'name email')
      .lean(),
    Order.countDocuments(filter),
  ]);

  const hasMore = skip + limitNum < total;

  res.json({
    ok: true,
    data: {
      items: orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        hasMore,
      },
    },
  });
});

/**
 * Update order status (Admin only)
 * PATCH /api/orders/:id/status
 */
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status }: UpdateOrderStatusRequest = req.body;

  const order = await Order.findById(id);
  if (!order) {
    throw createError('Order not found', 404);
  }

  order.status = status;
  await order.save();

  logger.info(`Order status updated: ${order.orderNumber} -> ${status} by ${req.user?.email}`);

  res.json({
    ok: true,
    message: 'Order status updated successfully',
    data: { order },
  });
});