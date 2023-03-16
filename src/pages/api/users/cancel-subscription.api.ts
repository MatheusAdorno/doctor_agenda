import { stripe } from '@/lib/stripe'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { buildNextAuthOptions } from '../auth/[...nextauth].api'

const updateProfileBodySchema = z.object({
  activeSubscriptionId: z.string(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'PUT') {
    return res.status(405).end()
  }

  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  if (!session) {
    return res.status(401).end()
  }

  const { activeSubscriptionId } = updateProfileBodySchema.parse(req.body)

  stripe.subscriptions.update(activeSubscriptionId, {
    cancel_at_period_end: true,
  })

  return res.status(204).end()
}
