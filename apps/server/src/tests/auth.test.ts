import request from 'supertest';
import { createServer } from '../app.js';
import { User } from '../models/User.js';

const app = createServer();

describe('Auth Controller', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.ok).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.token).toBeDefined();

      // Verify user was created in database
      const user = await User.findOne({ email: userData.email });
      expect(user).toBeTruthy();
      expect(user?.name).toBe(userData.name);
    });

    it('should return error for duplicate email', async () => {
      // Create user first
      await User.create({
        name: 'Existing User',
        email: 'existing@example.com',
        passwordHash: 'hashedpassword',
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'New User',
          email: 'existing@example.com',
          password: 'password123',
        })
        .expect(400);

      expect(response.body.ok).toBe(false);
      expect(response.body.message).toContain('already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      // Create test user
      const user = await User.create({
        name: 'Test User',
        email: 'login@example.com',
        passwordHash: 'password123',
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123',
        })
        .expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body.data.user.email).toBe('login@example.com');
      expect(response.body.data.token).toBeDefined();
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return user profile when authenticated', async () => {
      // Create user and get token
      const user = await User.create({
        name: 'Test User',
        email: 'profile@example.com',
        passwordHash: 'password123',
      });

      const token = user.generateAuthToken();

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body.data.user.email).toBe('profile@example.com');
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.ok).toBe(false);
    });
  });
});