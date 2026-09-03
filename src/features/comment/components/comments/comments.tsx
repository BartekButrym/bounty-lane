'use client';

import { useEffect } from 'react';

import { useInView } from 'react-intersection-observer';

import { CardCompact } from '@/components/card-compact';
import type { PaginatedData } from '@/components/pagination/types';
import { CommentWithMetadata } from '@/features/comment/types';

import { CommentList } from '../comment-list';
import { CommentUpsertForm } from '../comment-upsert-form';
import { usePaginatedComments } from './use-paginated-comments';

type CommentsProps = {
  ticketId: string;
  paginatedComments: PaginatedData<CommentWithMetadata>;
};

export const Comments = ({ ticketId, paginatedComments }: CommentsProps) => {
  const {
    comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    invalidateComments,
    invalidateAttachments,
  } = usePaginatedComments(ticketId, paginatedComments);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <>
      <CardCompact
        title="Create comment"
        description="A new comment will be created"
        content={
          <CommentUpsertForm
            ticketId={ticketId}
            onCreateComment={invalidateComments}
          />
        }
      />

      <div className="flex flex-col gap-y-2 ml-8">
        <CommentList
          ticketId={ticketId}
          comments={comments}
          invalidateComments={invalidateComments}
          invalidateAttachments={invalidateAttachments}
        />
      </div>

      <div ref={ref}>
        {!hasNextPage && (
          <p className="text-right text-xs italic">No more comments</p>
        )}
      </div>
    </>
  );
};
