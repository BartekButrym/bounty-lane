'use server';

import { revalidatePath } from 'next/cache';

import { z } from 'zod';

import { getAuthOrRedirect } from '@/auth/cookie';
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from '@/components/form/utils/to-action-state';
import { inngest } from '@/lib/inngest';
import { prisma } from '@/lib/prisma';
import { accountProfilePath } from '@/path';

import { generateEmailVerificationCode } from '../utils/generate-email-verification-code';

const emailChangeSchema = z.object({
  newEmail: z.string().min(1, { message: 'Is required' }).max(191).email(),
});

export const emailChange = async (
  _actionState: ActionState,
  formData: FormData
) => {
  const { user } = await getAuthOrRedirect();

  try {
    const { newEmail } = emailChangeSchema.parse(Object.fromEntries(formData));

    if (newEmail === user.email) {
      return toActionState(
        'ERROR',
        'This is already your email address',
        formData
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail },
    });

    if (existingUser) {
      return toActionState('ERROR', 'Email already in use', formData);
    }

    const code = await generateEmailVerificationCode(user.id, newEmail);

    await inngest.send({
      name: 'app/auth.email-change',
      data: {
        userId: user.id,
        newEmail,
        code,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  revalidatePath(accountProfilePath());

  return toActionState(
    'SUCCESS',
    'Check your new email for a verification code'
  );
};
