import { serve } from 'inngest/next';

import { attachmentDeletedEvent } from '@/features/attachments/events/event-attachment-deleted';
import { emailChangeEvent } from '@/features/auth/events/event-email-change';
import { emailVerificationEvent } from '@/features/auth/events/event-email-verification';
import { invitationCreatedEvent } from '@/features/invitation/events/event-invitation-created';
import { invitationProcessingEvent } from '@/features/invitation/events/event-invitation-processing';
import { organizationDeletedEvent } from '@/features/organization/events/event-organization-deleted';
import { passwordResetFunction } from '@/features/password/events/event-password-reset';
import { ticketDeletedEvent } from '@/features/ticket/events/event-ticket-deleted';
import { inngest } from '@/lib/inngest';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    passwordResetFunction,
    emailVerificationEvent,
    emailChangeEvent,
    invitationCreatedEvent,
    invitationProcessingEvent,
    attachmentDeletedEvent,
    organizationDeletedEvent,
    ticketDeletedEvent,
  ],
});
