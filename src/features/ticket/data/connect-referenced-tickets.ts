import { prisma } from '@/lib/prisma';

export const connectReferencedTickets = async (
  ticketId: string,
  ticketIds: string[]
) => {
  const existingTickets = await prisma.ticket.findMany({
    where: {
      id: { in: ticketIds },
    },
    select: {
      id: true,
    },
  });

  if (!existingTickets.length) {
    return;
  }

  await prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      referencedTickets: {
        connect: existingTickets.map((ticket) => ({
          id: ticket.id,
        })),
      },
    },
  });
};
