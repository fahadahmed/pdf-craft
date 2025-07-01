import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import cors from 'cors';
import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
// import { getFirestore } from 'firebase-admin/firestore';
// import { getStorage } from 'firebase-admin/storage';
import type { ServiceAccount } from 'firebase-admin';
import serviceAccount from '../serviceAccountKey.json';

const corsHandler = cors({ origin: true });

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
  });
}
const auth = getAuth();
// const firestore = getFirestore();
// const storage = getStorage();

export const fetchCredits = onRequest((request, response) => {
  corsHandler(request, response, async () => {
    if (request.method !== 'GET') {
      response.status(405).send('Method not allowed');
      return;
    }

    const authHeader = request.headers.authorization || '';
    const idToken = authHeader.startsWith('Bearer ')
      ? authHeader.split('Bearer ')[1]
      : null;

    if (!idToken) {
      response.status(401).json({ error: 'No token provided' });
      return;
    }

    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      const userId = decodedToken.uid;
      logger.info(`Authenticated user: ${userId}`);

      // Simulate fetching credits
      const credits = { total: 100, used: 20, remaining: 80 };
      response.status(200).json(credits);
    } catch (error) {
      logger.error('Token verification failed', error);
      response.status(401).json({ error: 'Unauthorized' });
    }
  });
});
