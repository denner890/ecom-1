import admin from 'firebase-admin';
import logger from './logger.js';

// Initialize Firebase Admin SDK
let firebaseApp: admin.app.App | undefined;

try {
  // Initialize with service account (production)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  } 
  // Initialize with default credentials (development)
  else if (process.env.FIREBASE_PROJECT_ID) {
    firebaseApp = admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  }
  
  if (firebaseApp) {
    logger.info('🔥 Firebase Admin SDK initialized');
  }
} catch (error) {
  logger.warn('Firebase Admin SDK not initialized:', error);
}

/**
 * Verify Firebase ID token
 * @param idToken - Firebase ID token from client
 * @returns Decoded token with user info
 */
export async function verifyFirebaseToken(idToken: string) {
  try {
    if (!firebaseApp) {
      throw new Error('Firebase not initialized');
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
      picture: decodedToken.picture,
      emailVerified: decodedToken.email_verified,
    };
  } catch (error) {
    logger.error('Firebase token verification failed:', error);
    return null;
  }
}

/**
 * Create custom Firebase token for user
 * @param uid - User ID
 * @param additionalClaims - Additional claims to include
 */
export async function createCustomToken(uid: string, additionalClaims?: object) {
  try {
    if (!firebaseApp) {
      throw new Error('Firebase not initialized');
    }

    const customToken = await admin.auth().createCustomToken(uid, additionalClaims);
    return customToken;
  } catch (error) {
    logger.error('Failed to create custom token:', error);
    throw new Error('Failed to create custom token');
  }
}

/**
 * Get Firebase user by UID
 * @param uid - Firebase user UID
 */
export async function getFirebaseUser(uid: string) {
  try {
    if (!firebaseApp) {
      throw new Error('Firebase not initialized');
    }

    const userRecord = await admin.auth().getUser(uid);
    return {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      emailVerified: userRecord.emailVerified,
      disabled: userRecord.disabled,
      metadata: userRecord.metadata,
    };
  } catch (error) {
    logger.error('Failed to get Firebase user:', error);
    return null;
  }
}

/**
 * Update Firebase user
 * @param uid - Firebase user UID
 * @param properties - Properties to update
 */
export async function updateFirebaseUser(uid: string, properties: admin.auth.UpdateRequest) {
  try {
    if (!firebaseApp) {
      throw new Error('Firebase not initialized');
    }

    const userRecord = await admin.auth().updateUser(uid, properties);
    return userRecord;
  } catch (error) {
    logger.error('Failed to update Firebase user:', error);
    throw new Error('Failed to update user');
  }
}

/**
 * Delete Firebase user
 * @param uid - Firebase user UID
 */
export async function deleteFirebaseUser(uid: string) {
  try {
    if (!firebaseApp) {
      throw new Error('Firebase not initialized');
    }

    await admin.auth().deleteUser(uid);
    logger.info(`Firebase user deleted: ${uid}`);
  } catch (error) {
    logger.error('Failed to delete Firebase user:', error);
    throw new Error('Failed to delete user');
  }
}

export { firebaseApp };