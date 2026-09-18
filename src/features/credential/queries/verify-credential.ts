import { prisma } from '@/lib/prisma';
import { hashToken } from '@/utils/crypto';

export const verifyCredential = async (
  secret: string,
  organizationId: string
) => {
  const secretHash = hashToken(secret);

  const credential = await prisma.credential.findUnique({
    where: { secretHash },
  });

  if (!credential || credential.organizationId !== organizationId) {
    return null;
  }

  if (credential.revokedAt) {
    return null;
  }

  await prisma.credential.update({
    where: { id: credential.id },
    data: { lastUsed: new Date() },
  });

  return credential;
};
