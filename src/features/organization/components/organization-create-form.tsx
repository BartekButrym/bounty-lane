'use client';

import { useActionState } from 'react';

import { FieldError } from '@/components/form/field-error';
import { Form } from '@/components/form/form';
import { SubmitButton } from '@/components/form/submit-button';
import { EMPTY_ACTION_STATE } from '@/components/form/utils/to-action-state';
import { Input } from '@/components/ui/input';

import { createOrganization } from '../actions/create-organization';

export const OrganizationCreateForm = () => {
  const [actionState, action] = useActionState(
    createOrganization,
    EMPTY_ACTION_STATE
  );

  return (
    <Form action={action} actionState={actionState}>
      <div className="flex flex-col items-center gap-y-2">
        <Input
          name="name"
          placeholder="Name"
          defaultValue={actionState.payload?.get('name') as string}
        />
        <FieldError actionState={actionState} name="name" />
      </div>

      <SubmitButton label="Create" />
    </Form>
  );
};
