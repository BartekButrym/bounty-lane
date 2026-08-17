'use server';

import { getAuthOrRedirect } from '@/auth/cookie';
import {
  fromErrorToActionState,
  toActionState,
} from '@/components/form/utils/to-action-state';

import { sendEmailVerification } from '../emails/send-email-verification';
import { generateEmailVerificationCode } from '../utils/generate-email-verification-code';

export const emailVerificationResend = async () => {
  const { user } = await getAuthOrRedirect({
    checkEmailVerified: false,
  });

  try {
    const verificationCode = await generateEmailVerificationCode(
      user.id,
      user.email
    );

    const result = await sendEmailVerification(
      user.username,
      user.email,
      verificationCode
    );

    if (result.error) {
      return toActionState('ERROR', 'Faileed to send verification email');
    }
  } catch (error) {
    return fromErrorToActionState(error);
  }

  return toActionState('SUCCESS', 'Verification email has been sent');
};
