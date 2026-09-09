import Link from 'next/link';

import { LucideArrowDownLeftFromSquare } from 'lucide-react';

import { CardCompact } from '@/components/card-compact';
import { ticketPath } from '@/path';

import { getReferencingTickets } from '../queries/get-referencing-tickets';

type ReferencingTicketsProps = {
  ticketId: string;
};

const ReferencingTickets = async ({ ticketId }: ReferencingTicketsProps) => {
  const referencingTickets = await getReferencingTickets(ticketId);

  if (!referencingTickets.length) return null;

  return (
    <CardCompact
      title="Referencing Tickets"
      description="Tickets that reference this ticket in comments"
      content={
        <div className="mx-2 mb-4">
          {referencingTickets.map((referencingTicket) => (
            <div key={referencingTicket.id}>
              <Link
                className="flex gap-x-2 items-center text-sm"
                href={ticketPath(referencingTicket.id)}
              >
                <LucideArrowDownLeftFromSquare className="h-4 w-4" />
                {referencingTicket.title}
              </Link>
            </div>
          ))}
        </div>
      }
    />
  );
};

export { ReferencingTickets };
