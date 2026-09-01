import Link from 'next/link';

import clsx from 'clsx';
import { MoreVertical, Pencil, SquareArrowOutUpRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TICKET_ICONS } from '@/features/ticket/constants';
import { ticketEditPath, ticketPath } from '@/path';
import { toCurrencyFromCent } from '@/utils/currency';

import { TicketWithMetadata } from '../types';
import { TicketMoreMenu } from './ticket-more-menu';

type TicketItemProps = {
  ticket: TicketWithMetadata;
  isDetail?: boolean;
  attachments?: React.ReactNode;
  comments?: React.ReactNode;
};

export const TicketItem = async ({
  ticket,
  isDetail,
  attachments,
  comments,
}: TicketItemProps) => {
  const detailButton = (
    <Button asChild size="icon" variant="outline">
      <Link prefetch href={ticketPath(ticket.id)}>
        <SquareArrowOutUpRight className="h-4 w-4" />
      </Link>
    </Button>
  );

  const canUpdateTicket = ticket.permissions.canUpdateTicket;

  const editButton = canUpdateTicket ? (
    <Button asChild size="icon" variant="outline">
      <Link prefetch href={ticketEditPath(ticket.id)}>
        <Pencil className="h-4 w-4" />
      </Link>
    </Button>
  ) : ticket.isOwner ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0}>
          <Button size="icon" variant="outline" disabled>
            <Pencil className="h-4 w-4" />
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>
        You do not have permission to edit this ticket.
      </TooltipContent>
    </Tooltip>
  ) : null;

  const moreMenu = ticket.isOwner ? (
    <TicketMoreMenu
      ticket={ticket}
      trigger={
        <Button variant="outline" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      }
    />
  ) : null;

  return (
    <div
      className={clsx('w-full flex flex-col gap-y-4', {
        'max-w-[580px]': isDetail,
        'max-w-[420px]': !isDetail,
      })}
    >
      <div className="flex gap-x-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-x-2">
              <span>{TICKET_ICONS[ticket.status]}</span>
              <span className="truncate">{ticket.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={clsx('whitespace-break-spaces', {
                'line-clamp-3': !isDetail,
              })}
            >
              {ticket.content}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              {ticket.deadline} by {ticket.user.username}
            </p>
            <p className="text-sm text-muted-foreground">
              {toCurrencyFromCent(ticket.bounty)}
            </p>
          </CardFooter>
        </Card>
        <div className="flex flex-col gap-y-1">
          {isDetail ? (
            <>
              {editButton}
              {moreMenu}
            </>
          ) : (
            <>
              {detailButton}
              {editButton}
            </>
          )}
        </div>
      </div>
      {attachments}
      {comments}
    </div>
  );
};
