'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { z } from 'zod';

import { setCookieByKey } from '@/actions/cookies';
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from '@/components/form/utils/to-action-state';
import * as attachmentSubjectDTO from '@/features/attachments/dto/attachment-subject-dto';
import { filesSchema } from '@/features/attachments/schema/file';
import * as attachmentService from '@/features/attachments/service';
import { getAuthOrRedirect } from '@/features/auth/queries/get-auth-or-redirect';
import { isOwner } from '@/features/auth/utils/is-owner';
import * as ticketData from '@/features/ticket/data';
import { prisma } from '@/lib/prisma';
import { ticketPath } from '@/path';
import { findTicketIdsFromText } from '@/utils/find-ids-from-text';

import * as commentData from '../data';

const upsertCommentSchema = z.object({
  content: z.string().min(1).max(1024),
  files: filesSchema,
});

export const upsertComment = async (
  ticketId: string,
  commentId: string | undefined,
  _actionState: ActionState,
  formData: FormData
) => {
  const { user } = await getAuthOrRedirect();

  let comment;

  try {
    if (commentId) {
      const comment = await prisma.comment.findUnique({
        where: { id: commentId },
      });

      if (!comment || !isOwner(user, comment)) {
        return toActionState('ERROR', 'Not authorized');
      }
    }
    const data = upsertCommentSchema.parse({
      content: formData.get('content'),
      files: formData.getAll('files'),
    });

    comment = await commentData.createComment({
      userId: user.id,
      commentId,
      ticketId,
      content: data.content,
      include: {
        user: {
          select: {
            username: true,
          },
        },
        ticket: true,
      },
    });

    const subject = attachmentSubjectDTO.fromComment(comment);

    if (!subject) {
      return toActionState('ERROR', 'Comment not created');
    }

    await attachmentService.createAttachments({
      subject: subject,
      entity: 'COMMENT',
      entityId: comment.id,
      files: data.files,
    });

    await ticketData.connectReferencedTickets(
      ticketId,
      findTicketIdsFromText('tickets', data.content)
    );
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketPath(ticketId));

  if (commentId) {
    await setCookieByKey('toast', 'Comment updated');
    redirect(ticketPath(ticketId));
  }

  return toActionState('SUCCESS', 'Comment created', undefined, {
    ...comment,
    isOwner: true,
  });
};
