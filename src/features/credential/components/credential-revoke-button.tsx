'use client';

import { useRouter } from 'next/navigation';

import { LucideBan, LucideLoaderCircle } from 'lucide-react';

import { useConfirmDialog } from '@/components/confirm-dialog';
import { Button } from '@/components/ui/button';

import { revokeCredential } from '../actions/revoke-credential';

type CredentialRevokeButtonProps = {
  credentialId: string;
  organizationId: string;
};

export const CredentialRevokeButton = ({
  credentialId,
  organizationId,
}: CredentialRevokeButtonProps) => {
  const router = useRouter();

  const [revokeButton, revokeDialog] = useConfirmDialog({
    title: 'Revoke this credential?',
    description:
      'Any requests using this credential will be rejected immediately. This cannot be undone.',
    action: revokeCredential.bind(null, credentialId, organizationId),
    trigger: (isLoading) =>
      isLoading ? (
        <Button variant="destructive" size="icon">
          <LucideLoaderCircle className="h-4 w-4 animate-spin" />
        </Button>
      ) : (
        <Button variant="destructive" size="icon">
          <LucideBan className="w-4 h-4" />
        </Button>
      ),
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <>
      {revokeDialog}
      {revokeButton}
    </>
  );
};
