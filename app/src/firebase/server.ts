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

export async function initializeFirebaseAdminApp() {
  const isProd = import.meta.env.NODE_ENV === 'production';
  const storageBucket = import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET;

  console.log(isProd);

  if (!_app) {
    if (getApps().length === 0) {
      const credential = isProd
        ? applicationDefault()
        : cert(
            JSON.parse(
              import.meta.env.PUBLIC_FIREBASE_SERVICEACCOUNT_KEY
            ) as ServiceAccount
          );
      // const credential = applicationDefault();
      _app = initializeApp({
        credential,
        storageBucket,
      });
      console.log('Firebase admin SDK successfully initialised');
    } else {
      _app = getApps()[0];
      console.log('Firebase admin SDK already initialised');
    }
  }

  return _app;
}

initializeFirebaseAdminApp().catch((error) => {
  console.error('Error initializing Firebase Admin SDK:', error);
});

export async function getFirebaseApp() {
  if (!_app) {
    await initializeFirebaseAdminApp();
  }
  return _app!;
}

export async function getFirebaseAuth() {
  if (!_auth) {
    _auth = getAuth(await getFirebaseApp());
  }
  return _auth;
}
