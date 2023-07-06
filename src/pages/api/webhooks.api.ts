import { stripe } from '@/lib/stripe'
import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { saveSubscription } from './_lib/manageSubscription'
import getRawBody from 'raw-body'

export const config = {
  api: {
    bodyParser: false,
  },
}

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
])

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const secret = req.headers['stripe-signature']
    const buf = await getRawBody(req)

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        secret!,
        process.env.STRIPE_WEBHOOK_SECRET!,
      )
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).send(`Webhook error: ${err.message}`)
      }
      return res.status(400)
    }

    const { type } = event

    if (relevantEvents.has(type)) {
      try {
        switch (type) {
          case 'customer.subscription.updated':
          case 'customer.subscription.deleted': {
            const subscription = event.data.object as Stripe.Subscription

            await saveSubscription(
              subscription.id,
              subscription.customer.toString(),
              false,
            )
            break
          }
          case 'checkout.session.completed': {
            const checkoutSession = event.data.object as Stripe.Checkout.Session

            await saveSubscription(
              checkoutSession.subscription?.toString()!,
              checkoutSession.customer?.toString()!,
              true,
            )

            break
          }
          default:
            throw new Error('Unhandles event.')
        }
      } catch (err) {
        return res.json({ error: 'Webhook handler failed' })
      }
    }

    res.json({ received: true })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }
}
