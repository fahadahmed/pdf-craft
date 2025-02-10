import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
// import * as admin from 'firebase-admin';
import cors from 'cors';

const corsHandler = cors({ origin: true });

// if (!admin.apps.length) {
//   admin.initializeApp();
// }

function parseCookies(cookieHeader?: string): Record<string, string> {
  const list: Record<string, string> = {};
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach((cookie) => {
    const [name, ...rest] = cookie.split('=');
    list[name.trim()] = rest.join('=').trim();
  });
  return list;
}

export const mergePdfs = onRequest((request, response) => {
  corsHandler(request, response, async () => {
    if (request.method !== 'POST') {
      response.status(405).send('Method not allowed');
      return;
    }

    const cookies = parseCookies(request.headers.cookie || '');
    const sessionCookie = cookies.__session;

    if (!sessionCookie) {
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
