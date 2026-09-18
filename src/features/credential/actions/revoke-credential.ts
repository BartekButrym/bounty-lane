'use server';

import { revalidatePath } from 'next/cache';

import {
  fromErrorToActionState,
  toActionState,
} from '@/components/form/utils/to-action-state';
import { getAdminOrRedirect } from '@/features/memberships/queries/get-admin-or-redirect';
import { prisma } from '@/lib/prisma';
import { credentialsPath } from '@/path';

export const revokeCredential = async (
  credentialId: string,
  organizationId: string
) => {
  await getAdminOrRedirect(organizationId);

  try {
    const credential = await prisma.credential.findUnique({
      where: { id: credentialId },
    });

    if (!credential || credential.organizationId !== organizationId) {
      return toActionState('ERROR', 'Not authorized');
    }

    await prisma.credential.update({
      where: { id: credentialId },
      data: { revokedAt: new Date() },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(credentialsPath(organizationId));

  return toActionState('SUCCESS', 'Credential revoked');
};
