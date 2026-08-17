'use client';

import { useActionState } from 'react';

import { FieldError } from '@/components/form/field-error';
import { Form } from '@/components/form/form';
import { SubmitButton } from '@/components/form/submit-button';
import { EMPTY_ACTION_STATE } from '@/components/form/utils/to-action-state';
import { Input } from '@/components/ui/input';

import { emailChange } from '../actions/email-change';

export const EmailChangeForm = () => {
  const [actionState, action] = useActionState(emailChange, EMPTY_ACTION_STATE);

  return (
    <Form action={action} actionState={actionState}>
      <Input
        type="email"
        name="newEmail"
        placeholder="New email address"
        defaultValue={actionState.payload?.get('newEmail') as string}
      />
      <FieldError actionState={actionState} name="newEmail" />

      <SubmitButton label="Send verification code" />
    </Form>
  );
};
