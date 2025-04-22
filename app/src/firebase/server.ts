import {
  getApps,
  initializeApp,
  cert,
  applicationDefault,
} from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import type { ServiceAccount } from 'firebase-admin';

let _app: ReturnType<typeof initializeApp> | undefined;
let _auth: ReturnType<typeof getAuth> | undefined;

export function getFirebaseApp() {
  if (!_app) {
    const isProd = process.env.NODE_ENV === 'production';

    _app = initializeApp({
      credential: isProd
        ? applicationDefault()
        : cert(require('../serviceAccountKey.json') as ServiceAccount),
      storageBucket: process.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  }
  return _app;
}

export function getFirebaseAuth() {
  if (!_auth) {
    _auth = getAuth(getFirebaseApp());
  }
  return _auth;
}
