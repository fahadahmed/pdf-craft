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

export async function getFirebaseApp() {
  const isProd = import.meta.env.NODE_ENV === 'production';
  const storageBucket = import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET;

  if (!_app) {
    if (getApps().length === 0) {
      const credential = isProd
        ? applicationDefault()
        : cert(
            JSON.parse(
              import.meta.env.PUBLIC_FIREBASE_SERVICEACCOUNT_KEY
            ) as ServiceAccount
          );

      _app = initializeApp({
        credential,
        storageBucket,
      });
    } else {
      _app = getApps()[0];
    }
  }

  return _app;
}

export async function getFirebaseAuth() {
  if (!_auth) {
    _auth = getAuth(await getFirebaseApp());
  }
  return _auth;
}
