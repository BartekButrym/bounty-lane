import { prisma } from '@/lib/prisma';
import { findTicketIdsFromText } from '@/utils/find-ids-from-text';

import { Comment } from '../../../../generated/prisma/client';
import * as ticketData from '../data/disconnect-referenced-tickets';

export const disconnectReferencedTicketsViaComment = async (
  comment: Comment
) => {
  const ticketId = comment.ticketId;
  const ticketIds = findTicketIdsFromText('tickets', comment.content);

  if (!ticketIds.length) return;

  const comments = await prisma.comment.findMany({
    where: {
      ticketId: comment.ticketId,
      id: {
        not: comment.id,
      },
    },
  });

  const allOtherContent = comments.map((comment) => comment.content).join(' ');

  const allOtherTicketIds = findTicketIdsFromText('tickets', allOtherContent);

  const ticketsIdsToRemove = ticketIds.filter(
    (ticketId) => !allOtherTicketIds.includes(ticketId)
  );

  await ticketData.disconnectReferencedTickets(ticketId, ticketsIdsToRemove);
};
