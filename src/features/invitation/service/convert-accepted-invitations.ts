import { prisma } from '@/lib/prisma';

type ConvertAcceptedInvitationsToMembershipsArgs = {
  userId: string;
  email: string;
};

export const convertAcceptedInvitationsToMemberships = async ({
  userId,
  email,
}: ConvertAcceptedInvitationsToMembershipsArgs) => {
  const invitations = await prisma.invitation.findMany({
    where: {
      email,
      status: 'ACCEPTED_WITHOUT_ACCOUNT',
    },
  });

  if (invitations.length === 0) {
    return;
  }

  await prisma.$transaction([
    prisma.invitation.deleteMany({
      where: {
        email,
      },
    }),
    prisma.membership.createMany({
      data: invitations.map((invitation) => ({
        organizationId: invitation.organizationId,
        userId,
        membershipRole: 'MEMBER',
        isActive: false,
      })),
    }),
  ]);
};
