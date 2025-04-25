import {
  getApps,
  initializeApp,
  cert,
  applicationDefault,
} from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import type { ServiceAccount } from 'firebase-admin';
import serviceAccount from '../serviceAccountKey.json';

let _app: ReturnType<typeof initializeApp> | undefined;
let _auth: ReturnType<typeof getAuth> | undefined;

export function getFirebaseApp() {
  const storageBucket = import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET;
  const isProd = import.meta.env.NODE_ENV === 'production';
  if (!_app) {
    if (getApps().length === 0) {
      _app = initializeApp({
        credential: isProd
          ? applicationDefault()
          : cert(serviceAccount as ServiceAccount),
        storageBucket,
      });
    } else {
      _app = getApps()[0];
    }
  }
  return _app;
}

export function getFirebaseAuth() {
  if (!_auth) {
    _auth = getAuth(getFirebaseApp());
  }
  return _auth;
}
