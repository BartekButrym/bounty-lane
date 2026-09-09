import { prisma } from '@/lib/prisma';

import { Prisma } from '../../../../generated/prisma/client';

type CreateCommentArgs<T> = {
  userId: string;
  commentId?: string;
  ticketId: string;
  content: string;
  include: Prisma.Subset<T, Prisma.CommentInclude>;
};

export const createComment = async <T extends Prisma.CommentInclude>({
  userId,
  commentId,
  ticketId,
  content,
  include,
}: CreateCommentArgs<T>) => {
  return await prisma.comment.upsert({
    where: { id: commentId || '' },
    create: {
      userId,
      ticketId,
      content,
    },
    update: {
      content: content,
    },
    include,
  });
};
