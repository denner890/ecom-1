import { Request, Response } from 'express';
import { Product } from '../models/Product.js';
import { asyncHandler, createError } from '../middleware/errorHandler.js';
import { CreateProductRequest, UpdateProductRequest, ProductQuery, } from '../types/index.js';
import logger from '../utils/logger.js';

/**
 * Get all products with filtering, sorting, and pagination
 * GET /api/products
 */
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 12,
    search,
    category,
    sort = '-createdAt',
  }: ProductQuery = req.query;

  // Build filter object
  const filter: any = { isActive: true };

  if (category) filter.category = category;
  if (search) {
    filter.$text = { $search: search };
  }

  // Calculate pagination
  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(50, Math.max(1, Number(limit)));
  const skip = (pageNum - 1) * limitNum;

  // Execute query with pagination
  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(sort as string)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Product.countDocuments(filter),
  ]);

  const hasMore = skip + limitNum < total;

  res.json({
    ok: true,
    data: {
      items: products,
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
 * Get single product by slug
 * GET /api/products/:slug
 */
export const getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;

  const product = await Product.findOne({ slug, isActive: true });

  if (!product) {
    throw createError('Product not found', 404);
  }

  res.json({
    ok: true,
    data: { product },
  });
});

/**
 * Create new product (Admin only)
 * POST /api/products
 */
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const productData: CreateProductRequest = req.body;

  // Generate slug from title if not provided
  if (!productData.slug) {
    productData.slug = productData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }

  // Calculate discount percentage if compareAtPrice is provided
  if (productData.compareAtPrice && productData.compareAtPrice > productData.price) {
    productData.discountPercent = Math.round(
      ((productData.compareAtPrice - productData.price) / productData.compareAtPrice) * 100
    );
  }

  const product = await Product.create(productData);

  logger.info(`Product created: ${product.title} by ${req.user?.email}`);

  res.status(201).json({
    ok: true,
    message: 'Product created successfully',
    data: { product },
  });
});

/**
 * Update product (Admin only)
 * PATCH /api/products/:id
 */
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData: UpdateProductRequest = req.body;

  const product = await Product.findById(id);
  if (!product) {
    throw createError('Product not found', 404);
  }

  // Calculate discount percentage if compareAtPrice is updated
  if (updateData.compareAtPrice && updateData.price) {
    if (updateData.compareAtPrice > updateData.price) {
      updateData.discountPercent = Math.round(
        ((updateData.compareAtPrice - updateData.price) / updateData.compareAtPrice) * 100
      );
    }
  }

  // Update product
  Object.assign(product, updateData);
  await product.save();

  logger.info(`Product updated: ${product.title} by ${req.user?.email}`);

  res.json({
    ok: true,
    message: 'Product updated successfully',
    data: { product },
  });
});

/**
 * Delete product (Admin only)
 * DELETE /api/products/:id
 */
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    throw createError('Product not found', 404);
  }

  await Product.findByIdAndDelete(id);

  logger.info(`Product deleted: ${product.title} by ${req.user?.email}`);

  res.json({
    ok: true,
    message: 'Product deleted successfully',
  });
});