import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { createServer } from '../app';
import { User } from '../models/User';  
import { jest } from '@jest/globals';   


// Mock Firebase Admin SDK
jest.mock('../utils/firebase', () => ({
  verifyFirebaseToken: jest.fn(),
  initializeFirebase: jest.fn(),
  getFirebaseAuth: jest.fn()
}));

import { verifyFirebaseToken } from '../utils/firebase';

const mockedVerifyFirebaseToken = verifyFirebaseToken as jest.MockedFunction<typeof verifyFirebaseToken>;

describe('Firebase Auth Controller', () => {
    let mongoServer: MongoMemoryServer;
    const app = createServer();

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        await User.deleteMany({});
        jest.clearAllMocks();
    });

    describe('POST /api/auth/firebase', () => {
        it('should create new user and return token for valid Firebase token', async () => {
            // Mock Firebase token verification
            mockedVerifyFirebaseToken.mockResolvedValue({
                uid: 'firebase-uid-123',
                email: 'test@example.com',
                name: 'Test User',
                picture: 'https://example.com/avatar.jpg'
            } as any);

            const response = await request(app)
                .post('/api/auth/firebase')
                .send({
                    idToken: 'valid-firebase-token'
                });

            expect(response.status).toBe(200);
            expect(response.body.ok).toBe(true);
            expect(response.body.data.token).toBeDefined();
            expect(response.body.data.user.email).toBe('test@example.com');
            expect(response.body.data.user.provider).toBe('google');
            expect(response.body.data.user.avatar).toBe('https://example.com/avatar.jpg');

            // Verify user was created in database
            const user = await User.findOne({ email: 'test@example.com' });
            expect(user).toBeTruthy();
            expect(user?.firebaseUid).toBe('firebase-uid-123');
            expect(user?.provider).toBe('google');
        });

        it('should update existing user for returning Firebase user', async () => {
            // Create existing user
            const existingUser = new User({
                name: 'Old Name',
                email: 'test@example.com',
                provider: 'google',
                firebaseUid: 'firebase-uid-123',
                avatar: 'old-avatar.jpg'
            });
            await existingUser.save();

            // Mock Firebase token verification
            mockedVerifyFirebaseToken.mockResolvedValue({
                uid: 'firebase-uid-123',
                email: 'test@example.com',
                name: 'Updated Name',
                picture: 'https://example.com/new-avatar.jpg'
            } as any);

            const response = await request(app)
                .post('/api/auth/firebase')
                .send({
                    idToken: 'valid-firebase-token'
                });

            expect(response.status).toBe(200);
            expect(response.body.ok).toBe(true);
            expect(response.body.data.user.name).toBe('Updated Name');
            expect(response.body.data.user.avatar).toBe('https://example.com/new-avatar.jpg');

            // Verify user was updated in database
            const updatedUser = await User.findById(existingUser._id);
            expect(updatedUser?.name).toBe('Updated Name');
            expect(updatedUser?.avatar).toBe('https://example.com/new-avatar.jpg');
        });

        it('should return error for invalid Firebase token', async () => {
            mockedVerifyFirebaseToken.mockRejectedValue(new Error('Invalid token'));

            const response = await request(app)
                .post('/api/auth/firebase')
                .send({
                    idToken: 'invalid-firebase-token'
                });

            expect(response.status).toBe(401);
            expect(response.body.ok).toBe(false);
            expect(response.body.message).toBe('Invalid Firebase token');
        });

        it('should return error for missing idToken', async () => {
            const response = await request(app)
                .post('/api/auth/firebase')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.ok).toBe(false);
            expect(response.body.message).toBe('Validation failed');
        });

        it('should link Firebase account to existing local account', async () => {
            // Create existing local user
            const existingUser = new User({
                name: 'Local User',
                email: 'test@example.com',
                passwordHash: 'hashed-password',
                provider: 'local'
            });
            await existingUser.save();

            // Mock Firebase token verification
            mockedVerifyFirebaseToken.mockResolvedValue({
                uid: 'firebase-uid-123',
                email: 'test@example.com',
                name: 'Google User',
                picture: 'https://example.com/avatar.jpg'
            } as any);

            const response = await request(app)
                .post('/api/auth/firebase')
                .send({
                    idToken: 'valid-firebase-token'
                });

            expect(response.status).toBe(200);
            expect(response.body.ok).toBe(true);

            // Verify account was linked
            const updatedUser = await User.findById(existingUser._id);
            expect(updatedUser?.firebaseUid).toBe('firebase-uid-123');
            expect(updatedUser?.provider).toBe('google');
            expect(updatedUser?.passwordHash).toBe('hashed-password'); // Should keep existing password
        });
    });
});

// function beforeEach(arg0: () => Promise<void>) {
//     throw new Error('Function not implemented.');
// }
