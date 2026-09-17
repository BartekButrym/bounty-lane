import { prisma } from '@/lib/prisma';

export const disconnectReferencedTickets = async (
  ticketId: string,
  ticketIds: string[]
) => {
  if (!ticketIds.length) {
    return;
  }

  await prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      referencedTickets: {
        disconnect: ticketIds.map((id) => ({
          id,
        })),
      },
    },
  });
};
