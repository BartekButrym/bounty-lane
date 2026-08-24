import { notFound } from 'next/navigation';

import { Breadcrumbs } from '@/components/breadcrumbs';
import { CardCompact } from '@/components/card-compact';
import { Separator } from '@/components/ui/separator';
import { getAuth } from '@/features/auth/queries/get-auth';
import { isOwner } from '@/features/auth/utils/is-owner';
import { CommentUpsertForm } from '@/features/comment/components/comment-upsert-form';
import { getComment } from '@/features/comment/queries/get-comment';
import { getTicket } from '@/features/ticket/queries/get-ticket';
import { homePath, ticketPath } from '@/path';

type CommentEditPageProps = {
  params: Promise<{
    ticketId: string;
    commentId: string;
  }>;
};

const CommentEditPage = async ({ params }: CommentEditPageProps) => {
  const { ticketId, commentId } = await params;
  const ticket = await getTicket(ticketId);
  const comment = await getComment(commentId);
  const { user } = await getAuth();

  const isTicketFound = !!ticket;
  const isCommentFound = !!comment;
  const isCommentOwner = isOwner(user, comment);

  if (!isTicketFound || !isCommentFound || !isCommentOwner) {
    notFound();
  }

  const breadcrumbs = [
    { title: 'Tickets', href: homePath() },
    { title: ticket.title, href: ticketPath(ticketId) },
    { title: 'Edit comment' },
  ];

  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      <Separator />

      <CardCompact
        title="Edit comment"
        description="A comment will be updated"
        content={<CommentUpsertForm ticketId={ticketId} comment={comment} />}
        className="w-full max-w-[580px] self-center"
      />
    </div>
  );
};

export default CommentEditPage;
