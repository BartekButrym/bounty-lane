'use client';

import { useRouter } from 'next/navigation';

import { LucideLoaderCircle, LucideTrash } from 'lucide-react';

import { useConfirmDialog } from '@/components/confirm-dialog';
import { Button } from '@/components/ui/button';

import { deleteOrganization } from '../actions/delete-organization';

type OrganizationDeleteButton = {
  organizationId: string;
};

export const OrganizationDeleteButton = ({
  organizationId,
}: OrganizationDeleteButton) => {
  const router = useRouter();

  const [deleteButton, deleteDialog] = useConfirmDialog({
    action: deleteOrganization.bind(null, organizationId),
    trigger: (isPending) =>
      isPending ? (
        <LucideLoaderCircle className="w-4 h-4 animate-spin" />
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
