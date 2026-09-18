import { format } from 'date-fns';

import { Placeholder } from '@/components/placeholder';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { getCredentials } from '../queries/get-credentials';
import { CredentialRevokeButton } from './credential-revoke-button';

type CredentialListProps = {
  organizationId: string;
};

const CredentialList = async ({ organizationId }: CredentialListProps) => {
  const credentials = await getCredentials(organizationId);

  if (!credentials.length) {
    return <Placeholder label="No credentials for this organization" />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Created By</TableHead>
          <TableHead>Last Used</TableHead>
          <TableHead>Status</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {credentials.map((credential) => {
          const isRevoked = !!credential.revokedAt;

          const buttons = isRevoked ? null : (
            <CredentialRevokeButton
              credentialId={credential.id}
              organizationId={organizationId}
            />
          );

          return (
            <TableRow key={credential.id}>
              <TableCell
                className={
                  isRevoked ? 'text-muted-foreground line-through' : undefined
                }
              >
                {credential.name}
              </TableCell>
              <TableCell>
                {format(credential.createdAt, 'yyyy-MM-dd, HH:mm')}
              </TableCell>
              <TableCell>
                {credential.createdByUser?.username ?? 'Deleted User'}
              </TableCell>
              <TableCell>
                {credential.lastUsed
                  ? format(credential.lastUsed, 'yyyy-MM-dd, HH:mm')
                  : 'Never'}
              </TableCell>
              <TableCell>
                {isRevoked ? (
                  <span className="inline-flex items-center rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                    Revoked
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    Active
                  </span>
                )}
              </TableCell>
              <TableCell className="flex justify-end gap-x-2">
                {buttons}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export { CredentialList };
