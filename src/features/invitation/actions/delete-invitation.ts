'use server';

import { toActionState } from '@/components/form/utils/to-action-state';
import { getAdminOrRedirect } from '@/features/memberships/queries/get-admin-or-redirect';
import { prisma } from '@/lib/prisma';

export const deleteInvitation = async (
  email: string,
  organizationId: string
) => {
  const invitation = await prisma.invitation.findUnique({
    where: {
      invitationId: {
        email,
        organizationId,
      },
    },
  });

  if (!invitation) {
    return toActionState('ERROR', 'Invitation not found');
  }

  await getAdminOrRedirect(invitation.organizationId);

  await prisma.invitation.delete({
    where: {
      invitationId: {
        email,
        organizationId,
      },
    },
  });

  return toActionState('SUCCESS', 'Invitation deleted');
};
