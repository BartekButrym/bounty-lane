import { DeleteObjectCommand } from '@aws-sdk/client-s3';

import { s3 } from '@/lib/aws';
import { deleteAttachment, inngest } from '@/lib/inngest';

import { AttachmentEntity } from '../../../../generated/prisma/client';
import { generateS3Key } from '../utils/generate-s3-key';

export type AttachmentDeleteEventArgs = {
  attachmentId: string;
  organizationId: string;
  entityId: string;
  entity: AttachmentEntity;
  fileName: string;
};

export const attachmentDeletedEvent = inngest.createFunction(
  { id: 'attachment-deleted', triggers: [deleteAttachment] },
  async ({ event, step }) => {
    const { organizationId, entityId, entity, fileName, attachmentId } =
      event.data;

    await step.run('delete-s3-file', () =>
      s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: generateS3Key({
            organizationId,
            entityId,
            entity,
            fileName,
            attachmentId,
          }),
        })
      )
    );

    return { event, body: true };
  }
);
