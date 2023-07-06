import { GetStaticProps } from 'next'
import { Button, Heading, Text } from '@doctor-ui/react'
import { NextSeo } from 'next-seo'
import { Container, Header } from '../register/styles'
import {
  Cents,
  CentsAndPeriodPaymentContainer,
  HeaderDescription,
  Period,
  PriceBox,
  PriceValueContainer,
  PricingContainer,
  Real,
  RS,
  PriceBoxDescription,
} from './styles'
import { stripe } from '@/lib/stripe'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { api } from '@/lib/axios'
import { getStripeJs } from '@/lib/stripe-js'
import Error from 'next/error'
import { useState } from 'react'

interface PricingProps {
  product: {
    priceId: string
  }
}

export default function Pricing({ product }: PricingProps) {
  const [disableOnClick, setDisableOnClick] = useState(false)

  const session = useSession()
  const router = useRouter()

  async function handleSubscribe() {
    setDisableOnClick(true)

    if (!session) {
      router.push('/register')
    }

    try {
      const response = await api.put('/subscribe')

      const { sessionId } = response.data

      const stripe = await getStripeJs()

      await stripe?.redirectToCheckout({ sessionId })
    } catch (err) {
      if (err instanceof Error) {
        alert(err)
      }
      console.error(err)
    }
  }

  return (
    <>
      <NextSeo title="Escolha seu plano | Doctor Agenda" noindex />

      <Container>
        <Header>
          <Heading as="strong">Escolha o seu plano</Heading>
          <HeaderDescription>
            Para ativar a sua conta e voltar a ter todos os benefícios do Doctor
            Agenda é necessário assinar a plataforma.
          </HeaderDescription>
        </Header>

        <PricingContainer>
          <PriceBox>
            <Heading size="md">Plano Mensal</Heading>
            <PriceValueContainer>
              <RS>R$</RS>
              <Real size="4xl">19</Real>
              <CentsAndPeriodPaymentContainer>
                <Cents>,90</Cents>
                <Period>/mês</Period>
              </CentsAndPeriodPaymentContainer>
            </PriceValueContainer>
            <PriceBoxDescription>
              <Text size="sm">* Acesso por 12 meses.</Text>
              <Text size="sm">* A cobrança é realizada mensalmente.</Text>
            </PriceBoxDescription>

            <Button
              variant="secondary"
              onClick={handleSubscribe}
              disabled={disableOnClick}
            >
              Escolher Plano
            </Button>
          </PriceBox>

          {/* <PriceBox>
            <Heading size="md">Plano Mensal</Heading>
            <PriceValueContainer>
              <RS>R$</RS>
              <Real size="4xl">19</Real>
              <CentsAndPeriodPaymentContainer>
                <Cents>,90</Cents>
                <Period>/mês</Period>
              </CentsAndPeriodPaymentContainer>
            </PriceValueContainer>

            <Button variant="secondary" onClick={handleSubscribeMensal}>
              Escolher Plano
            </Button>
          </PriceBox> */}

          {/* <PriceBox>
            <PriceBoxHeader>
              <Heading size="md">Plano Anual</Heading>
              <Text size="sm">
                Receba 2 meses gratuitos ao assinar o plano anual
              </Text>
            </PriceBoxHeader>
            <PriceValueContainer>
              <RS>R$</RS>
              <Real size="4xl">199</Real>
              <CentsAndPeriodPaymentContainer>
                <Cents>,00</Cents>
                <Period>/ano</Period>
              </CentsAndPeriodPaymentContainer>
            </PriceValueContainer>

            <Button variant="secondary" onClick={handleSubscribeAnual}>
              Escolher Plano
            </Button>
          </PriceBox> */}
        </PricingContainer>
      </Container>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1Mm4yODQikGzhl8VAw7Brq6s', {
    expand: ['product'],
  })

  const product = {
    priceId: price.id,
  }

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  }
}
