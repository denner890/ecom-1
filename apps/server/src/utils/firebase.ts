import admin from 'firebase-admin';
import { logger } from './logger';

let firebaseApp: admin.app.App | null = null;

export const initializeFirebase = (): admin.app.App => {
  if (firebaseApp) {
    return firebaseApp;
  }

  try {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    const projectId = process.env.FIREBASE_PROJECT_ID;

    if (!serviceAccountKey || !projectId) {
      throw new Error('Firebase configuration missing. Please set FIREBASE_SERVICE_ACCOUNT_KEY and FIREBASE_PROJECT_ID');
    }

    let serviceAccount;
    try {
      serviceAccount = JSON.parse(serviceAccountKey);
    } catch (error) {
      throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_KEY format. Must be valid JSON');
    }

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: projectId
    });

    logger.info('Firebase Admin SDK initialized successfully');
    return firebaseApp;
  } catch (error) {
    logger.error('Failed to initialize Firebase Admin SDK:', error);
    throw error;
  }
};

export const verifyFirebaseToken = async (idToken: string): Promise<admin.auth.DecodedIdToken> => {
  try {
    const app = initializeFirebase();
    const decodedToken = await app.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    logger.error('Firebase token verification failed:', error);
    throw new Error('Invalid Firebase token');
  }
};

export const getFirebaseAuth = (): admin.auth.Auth => {
  const app = initializeFirebase();
  return app.auth();
};