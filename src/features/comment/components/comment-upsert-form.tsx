'use client';

import { useActionState } from 'react';

import { FieldError } from '@/components/form/field-error';
import { Form } from '@/components/form/form';
import { SubmitButton } from '@/components/form/submit-button';
import {
  ActionState,
  EMPTY_ACTION_STATE,
} from '@/components/form/utils/to-action-state';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ACCEPTED } from '@/features/attachments/constants';

import { Comment } from '../../../../generated/prisma/client';
import { upsertComment } from '../actions/upsert-comment';
import { CommentWithMetadata } from '../types';

type CommentUpsertFormProps = {
  ticketId: string;
  comment?: Comment;
  onCreateComment?: (comment: CommentWithMetadata | undefined) => void;
};

export const CommentUpsertForm = ({
  ticketId,
  comment,
  onCreateComment,
}: CommentUpsertFormProps) => {
  const [actionState, action] = useActionState(
    upsertComment.bind(null, ticketId, comment?.id),
    EMPTY_ACTION_STATE
  );

  const handleSuccess = (
    actionState: ActionState<CommentWithMetadata | undefined>
  ) => {
    onCreateComment?.(actionState.data);
  };

  return (
    <Form action={action} actionState={actionState} onSuccess={handleSuccess}>
      <Textarea
        name="content"
        placeholder="What's on your mind..."
        defaultValue={
          (actionState.payload?.get('content') as string) ?? comment?.content
        }
      />
      <FieldError name="content" actionState={actionState} />

      <Input
        name="files"
        id="files"
        type="file"
        multiple
        accept={ACCEPTED.join(',')}
      />
      <FieldError actionState={actionState} name="files" />

      <SubmitButton label={comment ? 'Update' : 'Comment'} />
    </Form>
  );
};
