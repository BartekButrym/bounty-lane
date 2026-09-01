import { inngest, verifyEmail } from '@/lib/inngest';
import { prisma } from '@/lib/prisma';

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

    const invitations = await prisma.invitation.findMany({
      where: {
        email: user.email,
        status: 'ACCEPTED_WITHOUT_ACCOUNT',
      },
    });

    await prisma.$transaction([
      prisma.invitation.deleteMany({
        where: {
          email: user.email,
        },
      }),
      prisma.membership.createMany({
        data: invitations.map((invitation) => ({
          organizationId: invitation.organizationId,
          userId: user.id,
          membershipRole: 'MEMBER',
          isActive: false,
        })),
      }),
    ]);

    return { event, body: true };
  }
);
