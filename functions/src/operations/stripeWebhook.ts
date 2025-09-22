import { onRequest } from 'firebase-functions/v2/https';
import { getFirestore } from 'firebase-admin/firestore';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  apiVersion: '2025-06-30.basil',
});

export const stripeWebhook = onRequest(
  {
    cors: true,
  },
  async (request, response) => {
    const sig = request.headers['stripe-signature'] as string;
    let event: Stripe.Event;
    console.log('🔔 Stripe webhook received:', request.rawBody);
    const rawBody = request.rawBody;
    console.log(
      'Stripe signature header:',
      request.headers['stripe-signature']
    );
    console.log('Webhook secret in use:', process.env.STRIPE_WEBHOOK_SECRET);
    console.log('Raw body length:', request.rawBody.length);
    try {
      event = stripe.webhooks.constructEvent(
        rawBody as Buffer, // 👈 force it to Buffer
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error('❌ Webhook signature verification failed.', err.message);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('✅ Event received:', event.id);
      console.log('Session details:', session);

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

          console.log(
            `✅ Updated user ${session.metadata.userId} with ${purchasedCredits} credits.`
          );
        }
      }
    }
    // Acknowledge immediately so Stripe doesn’t retry
    response.status(200).send('ok');
  }
);
