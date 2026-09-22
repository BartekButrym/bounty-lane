'use server';

import { revalidatePath } from 'next/cache';

import { z } from 'zod';

import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from '@/components/form/utils/to-action-state';
import { getAdminOrRedirect } from '@/features/memberships/queries/get-admin-or-redirect';
import { getStripeProvisioningByOrganization } from '@/features/stripe/queries/get-stripe-provisioning';
import { inngest } from '@/lib/inngest';
import { invitationsPath } from '@/path';

import * as invitationService from '../service';

const createInvitationSchema = z.object({
  email: z.string().min(1, { message: 'Is required' }).max(191).email(),
});

export const createInvitation = async (
  organizationId: string,
  _actionState: ActionState,
  formData: FormData
) => {
  const { user } = await getAdminOrRedirect(organizationId);

  const { allowedMembers, currentMembers } =
    await getStripeProvisioningByOrganization(organizationId);

  if (allowedMembers <= currentMembers) {
    return toActionState(
      'ERROR',
      'Upgrade your subscription to invite more members'
    );
  }

  try {
    const { email } = createInvitationSchema.parse({
      email: formData.get('email'),
    });

    const emailInvitationLink = await invitationService.createInvitation({
      invitedByUserId: user.id,
      organizationId,
      email,
    });

    await inngest.send({
      name: 'app/invitation.created',
      data: {
        userId: user.id,
        organizationId,
        email,
        emailInvitationLink,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(invitationsPath(organizationId));

  return toActionState('SUCCESS', 'User invited to organization');
};
