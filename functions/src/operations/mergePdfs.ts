import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import type { ServiceAccount } from 'firebase-admin';
import serviceAccount from '../serviceAccountKey.json';
import cors from 'cors';

const corsHandler = cors({ origin: true });

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
  });
}
const auth = getAuth();
const firestore = getFirestore();
const storage = getStorage();

export const mergePdfs = onRequest((request, response) => {
  corsHandler(request, response, async () => {
    if (request.method !== 'POST') {
      response.status(405).send('Method not allowed');
      return;
    }

    // Extract and verify session cookie
    const cookies = request.headers.cookie || '';
    const sessionCookie = cookies
      .split('; ')
      .find((c: string) => c.startsWith('__session='))
      ?.split('=')[1];

    try {
      if (sessionCookie) {
        const decodedToken = await auth.verifySessionCookie(
          sessionCookie,
          true
        );
        const userId = decodedToken.uid;
        logger.info(`Authenticated user: ${userId}`);
        logger.info(`Firestore instance: ${firestore}`);
        logger.info(`storage instance: ${storage}`);
      }
    } catch (error) {
      logger.error('Session verification failed', error);
      response.status(401).json({ error: 'Unauthorized' });
      return;
    }

    logger.info('mergePdfs logs!', { structuredData: true });
    logger.info(request.body, { structuredData: true });
    response.status(200).send({
      message: 'Files merged successfully',
    });
  });
});
