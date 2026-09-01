'use client';

import { useRouter } from 'next/navigation';

import { LucideLoaderCircle, LucideTrash } from 'lucide-react';

import { useConfirmDialog } from '@/components/confirm-dialog';
import { Button } from '@/components/ui/button';

import { deleteInvitation } from '../actions/delete-invitation';

type InvitationDeleteButtonProps = {
  email: string;
  organizationId: string;
};

export const InvitationDeleteButton = ({
  email,
  organizationId,
}: InvitationDeleteButtonProps) => {
  const router = useRouter();

  const [deleteButton, deleteDialog] = useConfirmDialog({
    action: deleteInvitation.bind(null, email, organizationId),
    trigger: (isLoading) =>
      isLoading ? (
        <Button variant="destructive" size="icon">
          <LucideLoaderCircle className="h-4 w-4 animate-spin" />
        </Button>
      ) : (
        <Button variant="destructive" size="icon">
          <LucideTrash className="w-4 h-4" />
        </Button>
      ),
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <>
      {deleteDialog}
      {deleteButton}
    </>
  );
};
