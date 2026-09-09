'use server';

import {
  fromErrorToActionState,
  toActionState,
} from '@/components/form/utils/to-action-state';
import { getAdminOrRedirect } from '@/features/memberships/queries/get-admin-or-redirect';

import * as invitationService from '../service';

export const deleteInvitation = async (
  email: string,
  organizationId: string
) => {
  await getAdminOrRedirect(organizationId);

  try {
    await invitationService.deleteInvitation({ email, organizationId });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  return toActionState('SUCCESS', 'Invitation deleted');
};
