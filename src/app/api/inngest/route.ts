import { serve } from 'inngest/next';

import { emailChangeEvent } from '@/features/auth/events/event-email-change';
import { emailVerificationEvent } from '@/features/auth/events/event-email-verification';
import { passwordResetFunction } from '@/features/password/events/event-password-reset';
import { inngest } from '@/lib/inngest';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [passwordResetFunction, emailVerificationEvent, emailChangeEvent],
});
