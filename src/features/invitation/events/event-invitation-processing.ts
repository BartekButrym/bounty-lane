import { inngest, verifyEmail } from '@/lib/inngest';
import { prisma } from '@/lib/prisma';

import * as invitationService from '../service';

export type InvitationProcessingEventArgs = {
  userId: string;
};

export const invitationProcessingEvent = inngest.createFunction(
  { id: 'invitation-processing', triggers: [verifyEmail] },
  async ({ event }) => {
    const { userId } = event.data;

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    await invitationService.convertAcceptedInvitationsToMemberships({
      userId: user.id,
      email: user.email,
    });

    return { event, body: true };
  }
);
