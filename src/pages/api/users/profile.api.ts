import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { buildNextAuthOptions } from '../auth/[...nextauth].api'

const updateProfileBodySchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O usuário precisa ter pelo menos três letras.' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'O usuário precisa ter apenas letras e hifens.',
    })
    .transform((username) => username.toLowerCase()),
  name: z
    .string()
    .min(3, { message: 'O nome precisa ter pelo menos três letras.' }),
  specialty: z.string(),
  subspecialty: z.string(),
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

  const { username, name, specialty, subspecialty } =
    updateProfileBodySchema.parse(req.body)

  const usernameAlreadyExists = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (usernameAlreadyExists && usernameAlreadyExists.id !== session.user.id) {
    return res.status(400).json({
      message: 'Username already taken.',
    })
  }

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      username,
      name,
      specialty,
      subspecialty,
    },
  })

  return res.status(204).end()
}
