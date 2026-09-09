import { AttachmentEntity } from '../../../../generated/prisma/client';
import {
  AttachmentSubject,
  AttachmentSubjectSourceComment,
  AttachmentSubjectSourceTicket,
} from '../types';

export type Type = AttachmentSubject;

export const fromTicket = (
  ticket: AttachmentSubjectSourceTicket | null
): Type | null => {
  if (!ticket) {
    return null;
  }

  return {
    entity: 'TICKET' as AttachmentEntity,
    entityId: ticket.id,
    organizationId: ticket.organizationId,
    userId: ticket.userId,
    ticketId: ticket.id,
    commentId: null,
  };
};

export const fromComment = (
  comment: AttachmentSubjectSourceComment | null
): Type | null => {
  if (!comment) {
    return null;
  }

  return {
    entity: 'COMMENT' as AttachmentEntity,
    entityId: comment.id,
    organizationId: comment.ticket.organizationId,
    userId: comment.userId,
    ticketId: comment.ticket.id,
    commentId: comment.id,
  };
};
