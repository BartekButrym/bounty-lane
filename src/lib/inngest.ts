import { Inngest, eventType, staticSchema } from 'inngest';

import { EmailChangeEventArgs } from '@/features/auth/events/event-email-change';
import { EmailVerificationEventArgs } from '@/features/auth/events/event-email-verification';
import { PasswordResetFunctionArgs } from '@/features/password/events/event-password-reset';

export const inngest = new Inngest({ id: 'bounty-lane' });

export const resetPassword = eventType('app/password.password-reset', {
  schema: staticSchema<PasswordResetFunctionArgs>(),
});

export const verifyEmail = eventType('app/auth.sign-up', {
  schema: staticSchema<EmailVerificationEventArgs>(),
});

export const changeEmail = eventType('app/auth.email-change', {
  schema: staticSchema<EmailChangeEventArgs>(),
});
