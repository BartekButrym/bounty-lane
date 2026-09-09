import { AttachmentEntity, Prisma } from '../../../generated/prisma/client';

export type AttachmentSubjectSourceTicket = Prisma.TicketGetPayload<{
  select: {
    id: true;
    organizationId: true;
    userId: true;
  };
}>;

export type AttachmentSubjectSourceComment = Prisma.CommentGetPayload<{
  include: {
    ticket: {
      id: true;
      select: {
        id: true;
        organizationId: true;
      };
    };
  };
}>;

export type AttachmentSubject = {
  entityId: string;
  entity: AttachmentEntity;
  organizationId: string;
  userId: string | null;
  ticketId: string;
  commentId: string | null;
};

export const isTicket = (
  subject: AttachmentSubject
): subject is AttachmentSubject & { entity: 'TICKET' } => {
  return subject.entity === 'TICKET';
};

export const isComment = (
  subject: AttachmentSubject
): subject is AttachmentSubject & { entity: 'COMMENT' } => {
  return subject.entity === 'COMMENT';
};
