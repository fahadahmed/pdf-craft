import { initializeApp, getApps } from 'firebase-admin/app';
import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';
import serviceAccount from '../serviceAccountKey.json' assert { type: 'json' };

const activeApps = getApps();

const initApp = () => {
  return initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
  });
};

export const app = activeApps.length > 0 ? activeApps[0] : initApp();
