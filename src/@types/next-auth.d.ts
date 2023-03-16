import { Subscription } from '@prisma/client'
import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    name: string
    email: string
    username: string
    specialty: string
    subspecialty: string
    stripe_customer_id: string
    avatar_url: string
  }

  interface Session {
    user: User
    activeSubscription: Subscription | null
  }
}
