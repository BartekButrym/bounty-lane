import { createOrganization, inngest } from '@/lib/inngest';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export type OrganizationCreatedEventArgs = {
  organizationId: string;
  byEmail: string;
};

export const organizationCreatedEvent = inngest.createFunction(
  { id: 'organization-created', triggers: [createOrganization] },
  async ({ event }) => {
    const { organizationId, byEmail } = event.data;

    const organization = await prisma.organization.findUniqueOrThrow({
      where: {
        id: organizationId,
      },
      include: {
        memberships: {
          include: {
            user: true,
          },
        },
      },
    });

    const stripeCustomer = await stripe.customers.create({
      name: organization.name,
      email: byEmail,
      metadata: {
        organizationId: organization.id,
      },
    });

    await prisma.stripeCustomer.create({
      data: {
        organizationId,
        customerId: stripeCustomer.id,
      },
    });

    return { event, body: true };
  }
);
