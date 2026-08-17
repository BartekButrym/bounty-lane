import EmailVerification from '@/emails/auth/email-verification';
import { resend } from '@/lib/resend';

export const sendEmailVerification = async (
  username: string,
  email: string,
  verificationCode: string
) => {
  return await resend.emails.send({
    from: 'no-reply@bounty-lane.com',
    to: email,
    subject: 'Email Verification from BountyLane',
    react: <EmailVerification toName={username} code={verificationCode} />,
  });
};
