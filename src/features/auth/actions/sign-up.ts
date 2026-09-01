'use server';

import { redirect } from 'next/navigation';

import { z } from 'zod';

import { setSessionCookie } from '@/auth/cookie';
import { hashPassword } from '@/auth/password';
import { createSession } from '@/auth/session';
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from '@/components/form/utils/to-action-state';
import { inngest } from '@/lib/inngest';
import { prisma } from '@/lib/prisma';
import { signInPath, ticketsPath } from '@/path';
import { generateRandomToken } from '@/utils/crypto';
import { getBaseUrl } from '@/utils/url';

import { Prisma } from '../../../../generated/prisma/client';
import { sendEmailWelcome } from '../../password/email/send-email-welcome';

const signUpSchema = z
  .object({
    username: z
      .string()
      .min(1)
      .max(191)
      .refine(
        (value) => !value.includes(' '),
        'Username cannot contain spaces'
      ),
    email: z.string().min(1, { message: 'Is required' }).max(191).email(),
    password: z.string().min(6).max(191),
    confirmPassword: z.string().min(6).max(191),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      });
    }
  });

export const signUp = async (_actionState: ActionState, formData: FormData) => {
  try {
    const { username, email, password } = signUpSchema.parse(
      Object.fromEntries(formData)
    );

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
      },
    });

    await inngest.send({
      name: 'app/auth.sign-up',
      data: {
        userId: user.id,
      },
    });

    const sessionToken = generateRandomToken();
    const session = await createSession(sessionToken, user.id);

    await setSessionCookie(sessionToken, session.expiresAt);

    const loginUrl = getBaseUrl() + signInPath();

    await sendEmailWelcome(user.username, user.email, loginUrl);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return toActionState(
        'ERROR',
        'Either email or username is already in use'
      );
    }

    return fromErrorToActionState(error, formData);
  }

  redirect(ticketsPath());
};
