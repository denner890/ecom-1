import request from 'supertest';
import { createServer } from '../app.js';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';

const app = createServer();

describe('Product Controller', () => {
  let adminToken: string;
  let userToken: string;

  beforeEach(async () => {
    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: 'password123',
      role: 'admin',
    });
    adminToken = admin.generateAuthToken();

    // Create regular user
    const user = await User.create({
      name: 'Regular User',
      email: 'user@example.com',
      passwordHash: 'password123',
      role: 'user',
    });
    userToken = user.generateAuthToken();
  });

  describe('GET /api/products', () => {
    it('should return paginated products', async () => {
      // Create test products
      await Product.create([
        {
          title: 'Test Product 1',
          slug: 'test-product-1',
          description: 'Test description',
          images: ['https://example.com/image1.jpg'],
          price: 29.99,
          category: 'test',
          stock: 10,
        },
        {
          title: 'Test Product 2',
          slug: 'test-product-2',
          description: 'Test description 2',
          images: ['https://example.com/image2.jpg'],
          price: 39.99,
          category: 'test',
          stock: 5,
        },
      ]);

      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body.data.items).toHaveLength(2);
      expect(response.body.data.pagination).toBeDefined();
    });
  });

  describe('POST /api/products', () => {
    it('should create product when admin authenticated', async () => {
      const productData = {
        title: 'New Product',
        description: 'A great new product',
        images: ['https://example.com/image.jpg'],
        price: 49.99,
        category: 'electronics',
        stock: 20,
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(productData)
        .expect(201);

      expect(response.body.ok).toBe(true);
      expect(response.body.data.product.title).toBe(productData.title);
      expect(response.body.data.product.slug).toBe('new-product');
    });

    it('should return 403 when not admin', async () => {
      const productData = {
        title: 'New Product',
        description: 'A great new product',
        images: ['https://example.com/image.jpg'],
        price: 49.99,
        category: 'electronics',
        stock: 20,
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send(productData)
        .expect(403);

      expect(response.body.ok).toBe(false);
    });
  });
});