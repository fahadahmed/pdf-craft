import { initializeApp, getApps, getApp } from 'firebase/app'
// import { getAuth, connectAuthEmulator } from 'firebase/auth'
// import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getPerformance } from 'firebase/performance'

const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSENGER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
  measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID,
}

const app = !getApps.length ? initializeApp(firebaseConfig) : getApp()

export const perf = getPerformance(app)

// TODO: Fix the firebase emulation

// if (import.meta.env.MODE === 'development') {
//   const auth = getAuth(app)
//   connectAuthEmulator(auth, 'http://localhost:9099')

//   const firestore = getFirestore(app)
//   connectFirestoreEmulator(firestore, 'localhost', 8080)
// }
export { app }
