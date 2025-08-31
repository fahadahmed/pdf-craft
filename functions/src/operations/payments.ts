import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import Stripe from 'stripe';
import * as dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  apiVersion: '2025-06-30.basil',
});

export const processPayment = onRequest(async (request, response) => {
  if (request.method !== 'POST') {
    response.status(405).send('Method not allowed');
    return;
  }

  // Here you would typically handle the payment processing logic
  // For example, integrating with a payment gateway like Stripe or PayPal
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: 299,
            product_data: { name: 'PCD-Craft Credits' },
          },
          quantity: 1,
        },
      ],
      success_url: 'http://localhost:4321/dashboard',
      cancel_url: 'http://localhost:4321/dashboard',
    });

    response.status(200).json({ url: session.url });
  } catch (error) {
    logger.error('Payment processing error', error);
    response.status(500).json({ error: 'Payment processing failed' });
    return;
  }
});

// import cors from 'cors';
// import admin from 'firebase-admin';
// import { getAuth } from 'firebase-admin/auth';
// // import { getFirestore } from 'firebase-admin/firestore';
// // import { getStorage } from 'firebase-admin/storage';
// import type { ServiceAccount } from 'firebase-admin';
// import serviceAccount from '../serviceAccountKey.json';

// const corsHandler = cors({ origin: true });

// if (admin.apps.length === 0) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount as ServiceAccount),
//   });
// }
// const auth = getAuth();
// // const firestore = getFirestore();
// // const storage = getStorage();

// export const fetchCredits = onRequest((request, response) => {
//   corsHandler(request, response, async () => {
//     if (request.method !== 'GET') {
//       response.status(405).send('Method not allowed');
//       return;
//     }

//     const authHeader = request.headers.authorization || '';
//     const idToken = authHeader.startsWith('Bearer ')
//       ? authHeader.split('Bearer ')[1]
//       : null;

//     if (!idToken) {
//       response.status(401).json({ error: 'No token provided' });
//       return;
//     }

//     try {
//       const decodedToken = await auth.verifyIdToken(idToken);
//       const userId = decodedToken.uid;
//       logger.info(`Authenticated user: ${userId}`);

//       // Simulate fetching credits
//       const credits = { total: 100, used: 20, remaining: 80 };
//       response.status(200).json(credits);
//     } catch (error) {
//       logger.error('Token verification failed', error);
//       response.status(401).json({ error: 'Unauthorized' });
//     }
//   });
// });
