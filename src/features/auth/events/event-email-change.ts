import { changeEmail, inngest } from '@/lib/inngest';
import { prisma } from '@/lib/prisma';

import { sendEmailChangeVerification } from '../emails/send-email-change-verification';

export type EmailChangeEventArgs = {
  userId: string;
  newEmail: string;
  code: string;
};

export const emailChangeEvent = inngest.createFunction(
  { id: 'email-change', triggers: [changeEmail] },
  async ({ event }) => {
    const { userId, newEmail, code } = event.data;

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    const result = await sendEmailChangeVerification(
      user.username,
      newEmail,
      code
    );

    if (result.error) {
      throw new Error(`${result.error.name}: ${result.error.message}`);
    }

    return { event, body: result };
  }
);
