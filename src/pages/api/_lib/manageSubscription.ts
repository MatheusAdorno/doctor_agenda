import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createAction = false,
) {
  const user = await prisma.user.findFirst({
    where: {
      stripe_customer_id: customerId,
    },
  })

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  if (createAction) {
    await prisma.subscription.create({
      data: {
        id: subscription.id,
        user_id: user!.id,
        status: subscription.status,
        price_id: subscription.items.data[0].price.id,
      },
    })
  } else {
    await prisma.subscription.update({
      where: {
        id: subscription.id,
      },
      data: {
        status: subscription.status,
      },
    })
  }
}
