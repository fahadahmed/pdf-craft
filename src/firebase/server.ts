import { initializeApp, cert, getApps } from 'firebase-admin/app'
import type { ServiceAccount } from 'firebase-admin'
import serviceAccount from '../serviceAccountKey.json' assert { type: 'json' }

const activeApps = getApps()

const initApp = () => {
  return initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
  })
}

export const app = activeApps.length === 0 ? initApp() : activeApps[0]
