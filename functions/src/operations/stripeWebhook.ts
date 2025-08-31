import { onRequest } from 'firebase-functions/v2/https';
import { getFirestore } from 'firebase-admin/firestore';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  apiVersion: '2025-06-30.basil',
});

export const stripeWebhook = onRequest(
  { secrets: ['STRIPE_WEBHOOK_SECRET'], cors: true },
  async (request, response) => {
    const sig = request.headers['stripe-signature'] as string;
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        request.rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err}`);
      return;
    }
  }
);
