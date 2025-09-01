import request from 'supertest';
import { createServer } from '../app.js';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { Cart } from '../models/Cart.js';
import { Order } from '../models/Order.js';
import mongoose from 'mongoose';

const app = createServer();

describe('Order Controller', () => {
  let userToken: string;
  let adminToken: string;
  let userId: string;
  let productId: string;

  beforeEach(async () => {
    // Create test user
    const user = await User.create({
      name: 'Test User',
      email: 'order@example.com',
      passwordHash: 'password123',
    });
    userToken = user.generateAuthToken();
    userId = user._id.toString();

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: 'password123',
      role: 'admin',
    });
    adminToken = admin.generateAuthToken();

    // Create test product
    const product = await Product.create({
      title: 'Test Product',
      slug: 'test-product',
      description: 'Test description',
      images: ['https://example.com/image.jpg'],
      price: 29.99,
      category: 'test',
      stock: 10,
    });
    productId = product._id.toString();

    // Add item to cart
    await Cart.create({
      userId,
      items: [{
        _id: new mongoose.Types.ObjectId(),
        productId,
        title: 'Test Product',
        priceSnapshot: 29.99,
        qty: 2,
      }],
    });
  });

  describe('POST /api/orders', () => {
    it('should create order from cart', async () => {
      const orderData = {
        shippingAddress: {
          name: 'Test User',
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zip: '12345',
          country: 'US',
        },
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData)
        .expect(201);

      expect(response.body.ok).toBe(true);
      expect(response.body.data.order.items).toHaveLength(1);
      expect(response.body.data.order.grandTotal).toBe(59.98); // 2 * 29.99

      // Verify cart was cleared
      const cart = await Cart.findOne({ userId });
      expect(cart?.items).toHaveLength(0);

      // Verify product stock was updated
      const product = await Product.findById(productId);
      expect(product?.stock).toBe(8); // 10 - 2
    });
  });

  describe('GET /api/orders/my', () => {
    it('should return user orders', async () => {
      // Create test order
      await Order.create({
        userId,
        items: [{
          productId,
          title: 'Test Product',
          priceAtPurchase: 29.99,
          qty: 1,
        }],
        subtotal: 29.99,
        discountTotal: 0,
        grandTotal: 29.99,
      });

      const response = await request(app)
        .get('/api/orders/my')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body.data.items).toHaveLength(1);
    });
  });

  describe('PATCH /api/orders/:id/status', () => {
    it('should update order status when admin', async () => {
      const order = await Order.create({
        userId,
        items: [{
          productId,
          title: 'Test Product',
          priceAtPurchase: 29.99,
          qty: 1,
        }],
        subtotal: 29.99,
        discountTotal: 0,
        grandTotal: 29.99,
      });

      const response = await request(app)
        .patch(`/api/orders/${order._id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'shipped' })
        .expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body.data.order.status).toBe('shipped');
    });
  });
});