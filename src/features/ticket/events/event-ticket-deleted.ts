import { deleteS3Prefix } from '@/lib/aws';
import { deleteTicketFiles, inngest } from '@/lib/inngest';

export type TicketDeletedEventArgs = {
  organizationId: string;
  ticketId: string;
};

export const ticketDeletedEvent = inngest.createFunction(
  { id: 'ticket-deleted', triggers: [deleteTicketFiles] },
  async ({ event, step }) => {
    const { organizationId, ticketId } = event.data;

    await step.run('delete-s3-files', () =>
      deleteS3Prefix(`${organizationId}/${ticketId}/`)
    );

    return { event, body: true };
  }
);
