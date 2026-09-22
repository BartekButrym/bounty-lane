import { deleteS3Prefix } from '@/lib/aws';
import { deleteOrganization, inngest } from '@/lib/inngest';

export type OrganizationDeletedEventArgs = {
  organizationId: string;
};

export const organizationDeletedEvent = inngest.createFunction(
  { id: 'organization-deleted', triggers: [deleteOrganization] },
  async ({ event, step }) => {
    const { organizationId } = event.data;

    await step.run('delete-s3-files', () =>
      deleteS3Prefix(`${organizationId}/`)
    );

    return { event, body: true };
  }
);
