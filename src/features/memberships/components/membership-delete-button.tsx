'use client';

import { useRouter } from 'next/navigation';

import { LucideLoaderCircle, LucideLogOut } from 'lucide-react';

import { useConfirmDialog } from '@/components/confirm-dialog';
import { Button } from '@/components/ui/button';

import { deleteMembership } from '../actions/delete-membership';

type OrganizationDeleteButton = {
  organizationId: string;
  userId: string;
};

export const MembershipDeleteButton = ({
  organizationId,
  userId,
}: OrganizationDeleteButton) => {
  const router = useRouter();

  const [deleteButton, deleteDialog] = useConfirmDialog({
    action: deleteMembership.bind(null, { organizationId, userId }),
    trigger: (isPending) =>
      isPending ? (
        <LucideLoaderCircle className="w-4 h-4 animate-spin" />
      ) : (
        <Button variant="destructive" size="icon">
          <LucideLogOut className="w-4 h-4" />
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
