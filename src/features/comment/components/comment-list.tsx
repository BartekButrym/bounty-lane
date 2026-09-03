import { AttachmentCreateButton } from '@/features/attachments/components/attachment-create-button';
import { AttachmentDeleteButton } from '@/features/attachments/components/attachment-delete-button';
import { AttachmentList } from '@/features/attachments/components/attachment-list';

import { CommentWithMetadata } from '../types';
import { CommentDeleteButton } from './comment-delete-button';
import { CommentEditButton } from './comment-edit-button';
import { CommentItem } from './comment-item';

type CommentListProps = {
  ticketId: string;
  comments: CommentWithMetadata[];
  invalidateComments: (id: string) => void;
  invalidateAttachments: () => void;
};

export const CommentList = ({
  ticketId,
  comments,
  invalidateComments,
  invalidateAttachments,
}: CommentListProps) => {
  return comments.map((comment) => {
    const attachmentCreateButton = (
      <AttachmentCreateButton
        key="0"
        entityId={comment.id}
        entity="COMMENT"
        invalidateAttachments={invalidateAttachments}
      />
    );

    const commentDeleteButton = (
      <CommentDeleteButton
        key="1"
        id={comment.id}
        onDeleteComment={invalidateComments}
      />
    );

    const commentEditButton = (
      <CommentEditButton key="2" ticketId={ticketId} commentId={comment.id} />
    );

    const buttons = [
      ...(comment.isOwner
        ? [attachmentCreateButton, commentDeleteButton, commentEditButton]
        : []),
    ];

    const sections = [];

    if (comment.attachments.length) {
      sections.push({
        label: 'Attachments',
        content: (
          <AttachmentList
            attachments={comment.attachments}
            buttons={(attachmentId) => [
              ...(comment.isOwner
                ? [
                    <AttachmentDeleteButton
                      key="0"
                      id={attachmentId}
                      invalidateAttachments={invalidateAttachments}
                    />,
                  ]
                : []),
            ]}
          />
        ),
      });
    }

    return (
      <CommentItem
        key={comment.id}
        comment={comment}
        sections={sections}
        buttons={buttons}
      />
    );
  });
};
