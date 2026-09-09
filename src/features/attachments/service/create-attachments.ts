import { PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

import { s3 } from '@/lib/aws';

import { AttachmentEntity } from '../../../../generated/prisma/client';
import * as attachmentData from '../data/create-attachment';
import { AttachmentSubject } from '../types';
import { generateS3Key } from '../utils/generate-s3-key';

type CreateAttachmentsArgs = {
  subject: AttachmentSubject;
  entity: AttachmentEntity;
  entityId: string;
  files: File[];
};

export const createAttachments = async ({
  subject,
  entity,
  entityId,
  files,
}: CreateAttachmentsArgs) => {
  const attachments = [];

  try {
    for (const file of files) {
      const buffer = await Buffer.from(await file.arrayBuffer());
      const attachmentId = randomUUID();

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: generateS3Key({
            organizationId: subject.organizationId,
            entityId,
            entity,
            fileName: file.name,
            attachmentId,
          }),
          Body: buffer,
          ContentType: file.type,
        })
      );

      const attachment = await attachmentData.createAttachment({
        name: file.name,
        entity,
        entityId,
      });

      attachments.push(attachment);
    }
  } catch (error) {
    throw error;
  }

  return attachments;
};
