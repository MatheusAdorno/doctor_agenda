import { GetStaticProps } from 'next'
import { Button, Heading, MultiStep, Text } from '@doctor-ui/react'
import { NextSeo } from 'next-seo'
import { Container, Header } from '../styles'
import {
  Cents,
  CentsAndPeriodPaymentContainer,
  FinishingContainer,
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
      router.push('/')
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
            Para finalizar, escolha o seu plano no Doctor Agenda! Lembrando que
            você ganhará <span>30 dias gratuitos</span> para testar a plataforma
            e pode cancelar seu plano a qualquer momento antes do término do
            período de testes.
          </HeaderDescription>

          <MultiStep size={5} currentStep={5} />
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
              <Text size="sm">* Receba 30 dias gratuitos para testar.</Text>
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

        <FinishingContainer>
          <Text size="xs">
            * Ao assinar o plano seus primeiros 30 dias serão gratuitos e você
            pode cancelá-lo a qualquer momento antes da primeira cobrança, que
            ocorrerá após o período de testes
          </Text>
        </FinishingContainer>
      </Container>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1MlC6WDQikGzhl8V24YxUa4J', {
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
