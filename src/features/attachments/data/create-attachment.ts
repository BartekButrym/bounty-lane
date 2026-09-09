import { prisma } from '@/lib/prisma';

import { AttachmentEntity } from '../../../../generated/prisma/client';

type CreateAttachmentArgs = {
  name: string;
  entity: AttachmentEntity;
  entityId: string;
};

export const createAttachment = async ({
  name,
  entity,
  entityId,
}: CreateAttachmentArgs) => {
  return await prisma.attachment.create({
    data: {
      name,
      ...(entity === 'TICKET' ? { ticketId: entityId } : {}),
      ...(entity === 'COMMENT' ? { commentId: entityId } : {}),
      entity,
    },
  });
};
