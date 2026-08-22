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
import { getAuthOrRedirect } from '@/features/auth/queries/get-auth-or-redirect';
import { isOwner } from '@/features/auth/utils/is-owner';
import { prisma } from '@/lib/prisma';
import { ticketPath } from '@/path';

const upsertCommentSchema = z.object({
  content: z.string().min(1).max(1024),
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
    const data = upsertCommentSchema.parse(Object.fromEntries(formData));

    comment = await prisma.comment.upsert({
      where: { id: commentId || '' },
      create: {
        userId: user.id,
        ticketId,
        content: data.content,
      },
      update: {
        content: data.content,
      },
      include: {
        user: true,
      },
    });
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
