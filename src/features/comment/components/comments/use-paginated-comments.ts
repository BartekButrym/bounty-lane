import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

import { PaginatedData } from '@/components/pagination/types';

import { getComments } from '../../queries/get-comments';
import { CommentWithMetadata } from '../../types';

export const usePaginatedComments = (
  ticketId: string,
  paginatedComments: PaginatedData<CommentWithMetadata>
) => {
  const queryKey = ['comments', ticketId];

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey,
      queryFn: ({ pageParam }) => getComments(ticketId, pageParam),
      initialPageParam: undefined as
        | { id: string; createdAt: number }
        | undefined,
      getNextPageParam: (lastPage) =>
        lastPage.metadata.hasNextPage ? lastPage.metadata.cursor : undefined,
      initialData: {
        pages: [
          {
            list: paginatedComments.list,
            metadata: paginatedComments.metadata,
          },
        ],
        pageParams: [undefined],
      },
    });

  const comments = data.pages.flatMap((page) => page.list);

  const queryClient = useQueryClient();

  const invalidateComments = () => queryClient.invalidateQueries({ queryKey });
  const invalidateAttachments = () =>
    queryClient.invalidateQueries({ queryKey });

  return {
    comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    invalidateComments,
    invalidateAttachments,
  };
};
