'use client';

import { useActionState, useState } from 'react';

import { LucidePen } from 'lucide-react';

import { FieldError } from '@/components/form/field-error';
import { Form } from '@/components/form/form';
import { SubmitButton } from '@/components/form/submit-button';
import { EMPTY_ACTION_STATE } from '@/components/form/utils/to-action-state';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { updateOrganization } from '../actions/update-organization';

type OrganizationEditButtonProps = {
  organizationId: string;
  name: string;
};

export const OrganizationEditButton = ({
  organizationId,
  name,
}: OrganizationEditButtonProps) => {
  const [open, setOpen] = useState(false);

  const [actionState, action] = useActionState(
    updateOrganization.bind(null, organizationId),
    EMPTY_ACTION_STATE
  );

  return (
    <>
      <Button variant="outline" size="icon" onClick={() => setOpen(true)}>
        <LucidePen className="w-4 h-4" />
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <Form
            action={action}
            actionState={actionState}
            onSuccess={() => setOpen(false)}
          >
            <AlertDialogHeader>
              <AlertDialogTitle>Rename organization</AlertDialogTitle>
              <AlertDialogDescription>
                Enter a new name for this organization.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <Input
              name="name"
              placeholder="Name"
              defaultValue={
                (actionState.payload?.get('name') as string) ?? name
              }
            />
            <FieldError actionState={actionState} name="name" />

            <AlertDialogFooter>
              <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
              <SubmitButton label="Save" />
            </AlertDialogFooter>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
