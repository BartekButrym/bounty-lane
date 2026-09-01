'use server';

import {
  fromErrorToActionState,
  toActionState,
} from '@/components/form/utils/to-action-state';
import { getAdminOrRedirect } from '@/features/memberships/queries/get-admin-or-redirect';
import { inngest } from '@/lib/inngest';
import { prisma } from '@/lib/prisma';

import { getOrganizationsByUser } from '../queries/get-organizations-by-user';

export const deleteOrganization = async (organizationId: string) => {
  await getAdminOrRedirect(organizationId);

  try {
    const organizations = await getOrganizationsByUser();

    const canDelete = organizations.some(
      (organization) => organization.id === organizationId
    );

    if (!canDelete) {
      return toActionState('ERROR', 'Not a member of this organization');
    }

    await prisma.organization.delete({
      where: {
        id: organizationId,
      },
    });

    try {
      await inngest.send({
        name: 'app/organization.deleted',
        data: { organizationId },
      });
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    return fromErrorToActionState(error);
  }

  return toActionState('SUCCESS', 'Organization deleted');
};
