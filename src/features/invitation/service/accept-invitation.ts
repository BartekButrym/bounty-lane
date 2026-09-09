import { prisma } from '@/lib/prisma';
import { hashToken } from '@/utils/crypto';

export const acceptInvitationByToken = async (tokenId: string) => {
  const tokenHash = hashToken(tokenId);

  const invitation = await prisma.invitation.findUnique({
    where: {
      tokenHash,
    },
  });

  if (!invitation) {
    throw new Error('Revoked or invalid verification token');
  }

  const user = await prisma.user.findUnique({
    where: {
      email: invitation.email,
    },
  });

  if (!user) {
    await prisma.invitation.update({
      where: {
        tokenHash,
      },
      data: {
        status: 'ACCEPTED_WITHOUT_ACCOUNT',
      },
    });

    return;
  }

  await prisma.$transaction([
    prisma.invitation.delete({
      where: {
        tokenHash,
      },
    }),
    prisma.membership.create({
      data: {
        organizationId: invitation.organizationId,
        userId: user.id,
        membershipRole: 'MEMBER',
        isActive: false,
      },
    }),
  ]);
};
