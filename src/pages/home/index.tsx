import Image from 'next/image'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { Button, Heading, Text } from '@doctor-ui/react'
import {
  Container,
  Header,
  ContainerContent,
  Hero,
  Preview,
  HeaderButtons,
} from './styles'

import previewImage from '../../assets/app-preview4x.png'
import { ClaimUsernameForm } from './components/ClaimUsernameForm'
import { signIn, useSession } from 'next-auth/react'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()

  const session = useSession()

  function goToRegister() {
    router.push('/register')
  }

  async function handleConnectCalendar() {
    await signIn('google', {
      callbackUrl: `/update-profile`,
    })
  }

  useEffect(() => {
    if (session.data?.user) {
      router.push('/update-profile')
    }
  }, [router, session])

  return (
    <>
      <NextSeo
        title="Descomplique seus agendamentos | Doctor Agenda"
        description="Conecte seu calendário e permita que os seus pacientes marquem
        agendamentos a qualquer momento."
      />

      <Container>
        <Header>
          <Heading>
            Doctor Agenda<span>.</span>
          </Heading>
          <HeaderButtons>
            <Button variant="secondary" onClick={handleConnectCalendar}>
              Entrar
            </Button>
            <Button onClick={goToRegister}>Criar Conta</Button>
          </HeaderButtons>
        </Header>

        <ContainerContent>
          <Hero>
            <Heading as="h1" size="4xl">
              Agendamento descomplicado
            </Heading>
            <Text size="xl">
              Conecte seu calendário e permita que os seus pacientes realizem
              agendamentos a qualquer momento.
            </Text>

            <ClaimUsernameForm />
          </Hero>

          <Preview>
            <Image
              src={previewImage}
              height={400}
              quality={100}
              priority
              alt="Calendário simbolizando aplicação em funcionamento"
            />
          </Preview>
        </ContainerContent>
      </Container>
    </>
  )
}
