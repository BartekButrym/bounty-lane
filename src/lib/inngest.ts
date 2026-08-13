import { Inngest, eventType, staticSchema } from 'inngest';

import { PasswordResetFunctionArgs } from '@/features/password/events/event-password-reset';

export const inngest = new Inngest({ id: 'bounty-lane' });

export const resetPassword = eventType('app/password.password-reset', {
  schema: staticSchema<PasswordResetFunctionArgs>(),
});
