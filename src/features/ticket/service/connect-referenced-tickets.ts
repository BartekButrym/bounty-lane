import * as ticketData from '../data/connect-referenced-tickets';

export const connectReferencedTickets = async (
  ticketId: string,
  ticketIds: string[]
) => {
  await ticketData.connectReferencedTickets(ticketId, ticketIds);
};
