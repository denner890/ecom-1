import admin from 'firebase-admin';
import logger from './logger.js';

let firebaseApp: admin.app.App | undefined;

/**
 * Initialize Firebase Admin SDK
 * Call this once at app startup before using other functions.
 */
export function initializeFirebase() {
  if (firebaseApp) {
    // Already initialized
    return firebaseApp;
  }

  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
    } else if (process.env.FIREBASE_PROJECT_ID) {
      firebaseApp = admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
    }

    if (firebaseApp) {
      logger.info('🔥 Firebase Admin SDK initialized');
    } else {
      logger.warn('Firebase Admin SDK not initialized: No credentials or project ID found');
    }
  } catch (error) {
    logger.warn('Firebase Admin SDK initialization error:', error);
  }

  return firebaseApp;
}

/**
 * Verify Firebase ID token
 * @param idToken - Firebase ID token from client
 * @returns Decoded token with user info
 */
export async function verifyFirebaseToken(idToken: string) {
  if (!firebaseApp) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
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
  if (!firebaseApp) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }

  try {
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
  if (!firebaseApp) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }

  try {
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
  if (!firebaseApp) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }

  try {
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
  if (!firebaseApp) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }

  try {
    await admin.auth().deleteUser(uid);
    logger.info(`Firebase user deleted: ${uid}`);
  } catch (error) {
    logger.error('Failed to delete Firebase user:', error);
    throw new Error('Failed to delete user');
  }
}

// Export firebaseApp so it can be used directly if needed (after initialization)
export { firebaseApp };
