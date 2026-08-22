'use server';

import { redirect } from 'next/navigation';

import { z } from 'zod';

import { setCookieByKey } from '@/actions/cookies';
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from '@/components/form/utils/to-action-state';
import { prisma } from '@/lib/prisma';
import { signInPath } from '@/path';

import { Prisma } from '../../../../generated/prisma/client';
import { getAuthOrRedirect } from '../queries/get-auth-or-redirect';
import { validateEmailVerificationCode } from '../utils/validate-email-verification-code';

const emailChangeConfirmSchema = z.object({
  code: z.string().length(8),
});

export const emailChangeConfirm = async (
  _actionState: ActionState,
  formData: FormData
) => {
  const { user } = await getAuthOrRedirect();

  try {
    const { code } = emailChangeConfirmSchema.parse(
      Object.fromEntries(formData)
    );

    const pendingToken = await prisma.emailVerificationToken.findFirst({
      where: { userId: user.id },
    });

    if (!pendingToken) {
      return toActionState('ERROR', 'No pending email change request');
    }

    const newEmail = pendingToken.email;

    const validCode = await validateEmailVerificationCode(
      user.id,
      newEmail,
      code
    );

    if (!validCode) {
      return toActionState('ERROR', 'Invalid or expired code');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { email: newEmail },
    });

    await prisma.session.deleteMany({ where: { userId: user.id } });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return toActionState('ERROR', 'Email already in use');
    }

    return fromErrorToActionState(error, formData);
  }

  await setCookieByKey('toast', 'Email updated. Please sign in again');

  redirect(signInPath());
};
