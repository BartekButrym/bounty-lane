import { Inngest, eventType, staticSchema } from 'inngest';

import { AttachmentDeleteEventArgs } from '@/features/attachments/events/event-attachment-deleted';
import { EmailChangeEventArgs } from '@/features/auth/events/event-email-change';
import { EmailVerificationEventArgs } from '@/features/auth/events/event-email-verification';
import { InvitationCreateEventArgs } from '@/features/invitation/events/event-invitation-created';
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

export const createEmailInvitation = eventType('app/invitation.created', {
  schema: staticSchema<InvitationCreateEventArgs>(),
});

export const deleteAttachment = eventType('app/attachment.deleted', {
  schema: staticSchema<AttachmentDeleteEventArgs>(),
});
