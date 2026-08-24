'use server';

import { revalidatePath } from 'next/cache';

import { z } from 'zod';

import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from '@/components/form/utils/to-action-state';
import { getAdminOrRedirect } from '@/features/memberships/queries/get-admin-or-redirect';
import { prisma } from '@/lib/prisma';
import { organizationsPath } from '@/path';

const updateOrganizationSchema = z.object({
  name: z.string().min(1).max(191),
});

export const updateOrganization = async (
  organizationId: string,
  _actionState: ActionState,
  formData: FormData
) => {
  await getAdminOrRedirect(organizationId);

  try {
    const data = updateOrganizationSchema.parse({
      name: formData.get('name'),
    });

    await prisma.organization.update({
      where: { id: organizationId },
      data,
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  revalidatePath(organizationsPath());

  return toActionState('SUCCESS', 'Organization renamed');
};
