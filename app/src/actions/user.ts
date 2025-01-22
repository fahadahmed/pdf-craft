/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { app } from '../firebase/server';
import { getAuth } from 'firebase-admin/auth';

const SignUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const user = {
  createUser: defineAction({
    accept: 'form',
    input: SignUpSchema,
    handler: async (input, _ctx) => {
      const { name, email, password } = input;
      const auth = getAuth(app);
      try {
        const userRecord = await auth.createUser({
          email: email,
          password: password,
          displayName: name,
        });
        return {
          success: true,
          payload: {
            userId: userRecord.uid,
            name: userRecord.displayName,
            email: userRecord.email,
          },
        };
      } catch (error) {
        if (error instanceof z.ZodError) {
          return {
            success: false,
            error: 'validation error',
            issues: error.issues,
          };
        }

        if ((error as any).code === 'auth/email-already-exists') {
          return {
            success: false,
            error: 'Account with this email already exists',
          };
        }

        if ((error as any).code === 'auth/invalid-password') {
          return {
            success: false,
            error: 'Password must be at least 6 characters',
          };
        }

        // eslint-disable-next-line no-console
        console.log('error', error);
        return {
          success: false,
          error: 'Issue creating a new user',
        };
      }
    },
  }),
};
