'use server';

import { redirect } from 'next/navigation';

import { setCookieByKey } from '@/actions/cookies';
import { fromErrorToActionState } from '@/components/form/utils/to-action-state';
import { signInPath } from '@/path';

import * as invitationService from '../service';

export const acceptInvitation = async (tokenId: string) => {
  try {
    await invitationService.acceptInvitationByToken(tokenId);
  } catch (error) {
    return fromErrorToActionState(error);
  }

  await setCookieByKey('toast', 'Invitation accepted');
  redirect(signInPath());
};
