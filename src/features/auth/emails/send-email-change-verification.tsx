import EmailChangeVerification from '@/emails/auth/email-change-verification';
import { resend } from '@/lib/resend';

export const sendEmailChangeVerification = async (
  username: string,
  email: string,
  verificationCode: string
) => {
  return await resend.emails.send({
    from: 'no-reply@bounty-lane.com',
    to: email,
    subject: 'Confirm your new email for BountyLane',
    react: (
      <EmailChangeVerification toName={username} code={verificationCode} />
    ),
  });
};
