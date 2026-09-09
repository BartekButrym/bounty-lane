'use server';

import { revalidatePath } from 'next/cache';

import { z } from 'zod';

import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from '@/components/form/utils/to-action-state';
import { getAuthOrRedirect } from '@/features/auth/queries/get-auth-or-redirect';
import { isOwner } from '@/features/auth/utils/is-owner';
import { ticketPath } from '@/path';

import { AttachmentEntity } from '../../../../generated/prisma/client';
import { filesSchema } from '../schema/file';
import * as attachmentService from '../service';
import { isComment, isTicket } from '../types';

const createAttachmentsSchema = z.object({
  files: filesSchema.refine((files) => files.length !== 0, 'File is required'),
});

type CreateAttachmentArgs = {
  entityId: string;
  entity: AttachmentEntity;
};

export const createAttachments = async (
  { entityId, entity }: CreateAttachmentArgs,
  _actionState: ActionState,
  formData: FormData
) => {
  const { user } = await getAuthOrRedirect();

  const subject = await attachmentService.getAttachmentSubject(
    entityId,
    entity
  );

  if (!subject) {
    return toActionState('ERROR', 'Subject not found');
  }

  if (!isOwner(user, subject)) {
    return toActionState('ERROR', 'Not the owner of this subject');
  }

  try {
    const { files } = createAttachmentsSchema.parse({
      files: formData.getAll('files'),
    });

    await attachmentService.createAttachments({
      subject,
      entity,
      entityId,
      files,
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  switch (entity) {
    case 'TICKET': {
      if (isTicket(subject)) {
        revalidatePath(ticketPath(subject.ticketId));
      }

      break;
    }
    case 'COMMENT': {
      if (isComment(subject)) {
        revalidatePath(ticketPath(subject.ticketId));
      }
      break;
    }
  }

  return toActionState('SUCCESS', 'Attachment(s) uploaded');
};
