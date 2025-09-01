import request from 'supertest';
import { createServer } from '../app.js';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { Cart } from '../models/Cart.js';

const app = createServer();

describe('Cart Controller', () => {
  let userToken: string;
  let userId: string;
  let productId: string;

  beforeEach(async () => {
    // Create test user
    const user = await User.create({
      name: 'Test User',
      email: 'cart@example.com',
      passwordHash: 'password123',
    });
    userToken = user.generateAuthToken();
    userId = user._id.toString();

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
  });

  describe('GET /api/cart', () => {
    it('should return empty cart for new user', async () => {
      const response = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body.data.cart.items).toHaveLength(0);
      expect(response.body.data.cart.subtotal).toBe(0);
    });
  });

  describe('POST /api/cart', () => {
    it('should add item to cart', async () => {
      const response = await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId,
          qty: 2,
        })
        .expect(200);

      expect(response.body.ok).toBe(true);

      // Verify cart was updated
      const cart = await Cart.findOne({ userId });
      expect(cart?.items).toHaveLength(1);
      expect(cart?.items[0].qty).toBe(2);
    });

    it('should return error for invalid product', async () => {
      const response = await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: '507f1f77bcf86cd799439011', // Valid ObjectId but doesn't exist
          qty: 1,
        })
        .expect(404);

      expect(response.body.ok).toBe(false);
    });
  });
});