import { prisma } from '@/lib/prisma'
import { Avatar, Heading, Text } from '@doctor-ui/react'
import { Subscription } from '@prisma/client'
import { GetStaticPaths, GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'
import { ScheduleForm } from './ScheduleForm'
import {
  Container,
  UserHeader,
  SpecialtiesInLineContainer,
  ContainerAccountNotActive,
} from './styles'

interface ScheduleProps {
  user: {
    name: string
    specialty: string
    subspecialty: string
    avatarUrl: string
  }
  isAccountActive: Subscription | null
}

export default function Schedule({ user, isAccountActive }: ScheduleProps) {
  return (
    <>
      <NextSeo title={`Agendar com ${user.name} | Doctor Agenda`} />

      {isAccountActive && (
        <Container>
          <UserHeader>
            <Avatar src={user.avatarUrl} />
            <Heading>{user.name}</Heading>
            <SpecialtiesInLineContainer>
              {user.specialty && <Text>{user.specialty}</Text>}
              {user.subspecialty && <Text>- {user.subspecialty}</Text>}
            </SpecialtiesInLineContainer>
          </UserHeader>

          <ScheduleForm />
        </Container>
      )}

      {!isAccountActive && (
        <ContainerAccountNotActive>
          <Heading>Página Indisponível</Heading>
          <Text>Entre em contato diretamente com o seu médico.</Text>
        </ContainerAccountNotActive>
      )}
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const username = String(params?.username)

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return {
      notFound: true,
    }
  }

  const isAccountActive = await prisma.subscription.findFirst({
    where: {
      user_id: user.id,
      OR: [{ status: 'active' }, { status: 'trialing' }],
    },
  })

  return {
    props: {
      user: {
        name: user.name,
        specialty: user.specialty,
        subspecialty: user.subspecialty,
        avatarUrl: user.avatar_url,
      },
      isAccountActive,
    },
    revalidate: 1, // 1 day
  }
}
