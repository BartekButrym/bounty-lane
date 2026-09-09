import { prisma } from '@/lib/prisma';
import { emailInvitationPath } from '@/path';
import { generateRandomToken, hashToken } from '@/utils/crypto';
import { getBaseUrl } from '@/utils/url';

type CreateInvitationArgs = {
  invitedByUserId: string;
  organizationId: string;
  email: string;
};

export const createInvitation = async ({
  invitedByUserId,
  organizationId,
  email,
}: CreateInvitationArgs) => {
  const existingMembership = await prisma.membership.findFirst({
    where: {
      organizationId,
      user: {
        email,
      },
    },
  });

  if (existingMembership) {
    throw new Error('User is already a member of this organization');
  }

  await prisma.invitation.deleteMany({
    where: {
      email,
      organizationId,
    },
  });

  const tokenId = generateRandomToken();
  const tokenHash = hashToken(tokenId);

  await prisma.invitation.create({
    data: {
      tokenHash,
      invitedByUserId,
      organizationId,
      email,
    },
  });

  const pageUrl = getBaseUrl() + emailInvitationPath();

  return pageUrl + `/${tokenId}`;
};
