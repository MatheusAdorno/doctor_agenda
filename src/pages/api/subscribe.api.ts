import { stripe } from '@/lib/stripe'
import { getServerSession } from 'next-auth'
import { NextApiRequest, NextApiResponse } from 'next'
import { buildNextAuthOptions } from './auth/[...nextauth].api'
import { prisma } from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'PUT') {
    const session = await getServerSession(
      req,
      res,
      buildNextAuthOptions(req, res),
    )

    if (!session) {
      return res.status(401).end()
    }

    let customerId = session.user.stripe_customer_id

    if (!customerId) {
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
        // metadata
      })

      await prisma.user.update({
        where: {
          id: session!.user.id,
        },
        data: {
          stripe_customer_id: stripeCustomer.id,
        },
      })

      customerId = stripeCustomer.id
    }

    const previousSubscription = await prisma.subscription.findFirst({
      where: {
        user_id: session.user.id,
      },
    })

    let stripeCheckoutSession

    if (previousSubscription) {
      stripeCheckoutSession = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        billing_address_collection: 'auto',
        line_items: [{ price: 'price_1MlC6WDQikGzhl8V24YxUa4J', quantity: 1 }],
        mode: 'subscription',
        allow_promotion_codes: true,
        success_url: process.env.STRIPE_SUCCESS_URL!,
        cancel_url: process.env.STRIPE_CANCEL_URL!,
      })
    } else {
      stripeCheckoutSession = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        billing_address_collection: 'auto',
        line_items: [{ price: 'price_1MlC6WDQikGzhl8V24YxUa4J', quantity: 1 }],
        mode: 'subscription',
        allow_promotion_codes: true,
        success_url: process.env.STRIPE_SUCCESS_URL!,
        cancel_url: process.env.STRIPE_CANCEL_URL!,
        subscription_data: {
          trial_period_days: 30,
        },
      })
    }

    return res.status(200).json({ sessionId: stripeCheckoutSession.id })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }
}
