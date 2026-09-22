import Stripe from 'stripe';

import { prisma } from '@/lib/prisma';

import { StripeSubscriptionStatus } from '../../../../generated/prisma/client';

export const updateStripeCustomer = async (
  subscription: Stripe.Subscription,
  eventAt: number
) => {
  const stripeCustomer = await prisma.stripeCustomer.findUniqueOrThrow({
    where: {
      customerId: subscription.customer as string,
    },
  });

  if (!stripeCustomer.eventAt || stripeCustomer.eventAt < eventAt) {
    await prisma.stripeCustomer.update({
      where: {
        customerId: subscription.customer as string,
      },
      data: {
        subscriptionId: subscription.id,
        subscriptionStatus: subscription.status as StripeSubscriptionStatus,
        productId: subscription.items.data[0].price.product as string,
        priceId: subscription.items.data[0].price.id as string,
      },
    });
  }
};
