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

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const db = getFirestore();

      if (session.metadata?.userId && session.metadata?.credits) {
        const userRef = db.collection('users').doc(session.metadata.userId);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
          const userData = userDoc.data();
          const currentCredits = userData?.profile?.credits || 0;
          const purchasedCredits = parseInt(session.metadata.credits, 10);
          await userRef.update({
            'profile.credits': currentCredits + purchasedCredits,
            'profile.isSubscriber': true,
          });
        }
      }
    }
  }
);
