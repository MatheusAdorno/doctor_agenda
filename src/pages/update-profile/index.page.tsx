import { api } from '@/lib/axios'
import { stripe } from '@/lib/stripe'
import { buildNextAuthOptions } from '@/pages/api/auth/[...nextauth].api'
import { Avatar, Button, Heading, Text, TextInput } from '@doctor-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import dayjs from 'dayjs'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { Calendar, Link } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Container, Header } from '../register/styles'
import {
  FormError,
  ProfileBox,
  SpecilatiesContainer,
  CalendarUserHeader,
  SpecialtiesInLineContainer,
  ElementSeparator,
  MyCalendarButtonContainer,
  LogOutButtonContainer,
  AccountIsNotActiveContainer,
  SubscriptionBox,
  ChangeSubscriptionStatusContainer,
  ButtonCancelSubscription,
  ButtonSubscribe,
  SuccededHeaderContainer,
} from './styles'

interface PropsInterface {
  dateSubscriptionPeriodEndsFormatted: string | null
  activeSubscriptionId: string | null
  isSubscriptionCancelled: boolean
}

const updateProfileSchema = z.object({
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

type UpdateProfileData = z.infer<typeof updateProfileSchema>

export default function UpdateProfile({
  dateSubscriptionPeriodEndsFormatted,
  activeSubscriptionId,
  isSubscriptionCancelled,
}: PropsInterface) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
  })

  const session = useSession()

  const router = useRouter()

  const [usernameAlredyTakenMessage, setusernameAlredyTakenMessage] =
    useState<String | null>(null)
  const [profileUpdated, setProfileUpdated] = useState(false)
  const [usernameAfterUpdateProfile, setUsernameAfterUpdateProfile] = useState(
    session.data?.user.username,
  )

  const [linkCopied, setLinkCopied] = useState(false)

  const [nameInHeader, setNameInHeader] = useState(session.data?.user.name)
  const [specialtyInHeader, setSpecialtyInHeader] = useState(
    session.data?.user.specialty,
  )
  const [subspecialtyInHeader, setSubspecialtyInHeader] = useState(
    session.data?.user.subspecialty,
  )

  const [signOutClicked, setSignOutClicked] = useState(false)

  const [changeSubscriptionStatusButton, setChangeSubscriptionStatusButton] =
    useState(false)

  const accountIsActived = session.data?.activeSubscription

  useEffect(() => {
    setValue(
      'username',
      session.data?.user.username ? session.data.user.username : '',
    )

    setValue('name', session.data?.user.name ? session.data.user.name : '')

    setValue(
      'specialty',
      session.data?.user.specialty ? session.data.user.specialty : '',
    )

    setValue(
      'subspecialty',
      session.data?.user.subspecialty ? session.data.user.subspecialty : '',
    )
  }, [
    setValue,
    session.data?.user.username,
    session.data?.user.name,
    session.data?.user.specialty,
    session.data?.user.subspecialty,
  ])

  async function handleUpdateProfile(data: UpdateProfileData) {
    try {
      await api.put('/users/profile', {
        username: data.username,
        name: data.name,
        specialty: data.specialty,
        subspecialty: data.subspecialty,
      })
      // await router.push(`/schedule/${data.username}`)
      // window.open(`/schedule/${data.username}`)
      setUsernameAfterUpdateProfile(data.username)

      window.scrollTo(0, 0)
      setProfileUpdated(true)

      const myTimeout = setTimeout(() => {
        setProfileUpdated(false)
        clearTimeout(myTimeout)
      }, 6000)
    } catch (err) {
      if (err instanceof AxiosError && err?.response?.data?.message) {
        setusernameAlredyTakenMessage('Esse nome de usuário já está em uso.')
        return
      }
      console.error(err)
    }
  }

  function goToUpdateTimeIntervals() {
    router.push(`/update-time-intervals?username=${usernameAfterUpdateProfile}`)
  }

  function goToPricing() {
    router.push(`/pricing`)
  }

  function goToMyCalendar() {
    window.open(`/schedule/${usernameAfterUpdateProfile}`)
  }

  function copyLinkToClipboard() {
    navigator.clipboard.writeText(
      // Mudar link quando for para produção
      `http://doctoragenda.app/schedule/${usernameAfterUpdateProfile}`,
    )

    window.scrollTo(0, 0)
    setLinkCopied(true)

    const myTimeout = setTimeout(() => {
      setLinkCopied(false)
      clearTimeout(myTimeout)
    }, 6000)
  }

  async function cancelStripeSubscription() {
    if (activeSubscriptionId) {
      setChangeSubscriptionStatusButton(true)

      await api.put('/users/cancel-subscription', {
        activeSubscriptionId,
      })

      const myTimeout = setTimeout(() => {
        location.reload()
        clearTimeout(myTimeout)
      }, 1000)
    }
  }

  async function reactivateStripeSubscription() {
    if (activeSubscriptionId) {
      setChangeSubscriptionStatusButton(true)

      await api.put('/users/reactivate-subscription', {
        activeSubscriptionId,
      })

      const myTimeout = setTimeout(() => {
        location.reload()
        clearTimeout(myTimeout)
      }, 1000)
    }
  }

  async function logOut() {
    setSignOutClicked(true)
    await api.delete('/users/sign-out')
    window.location.href = '/'
  }

  return (
    <>
      <NextSeo title="Atualize seu perfil | Doctor Agenda" noindex />

      <Container>
        {profileUpdated && (
          <SuccededHeaderContainer>
            <Text>Seu perfil foi atualizado!</Text>
          </SuccededHeaderContainer>
        )}

        {linkCopied && (
          <SuccededHeaderContainer>
            <Text>Link para os seus agendamentos copiado!</Text>
          </SuccededHeaderContainer>
        )}
        {!accountIsActived && (
          <AccountIsNotActiveContainer>
            <Text>
              Você não possui uma assinatura ativa.{' '}
              <button type="button" onClick={goToPricing}>
                Clique aqui!
              </button>
            </Text>
          </AccountIsNotActiveContainer>
        )}
        <Header>
          <Heading as="strong">Atualização de Perfil</Heading>
          <Text>Mantenha suas informações sempre atualizadas.</Text>
        </Header>

        <ProfileBox as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
          <CalendarUserHeader>
            <Avatar
              src={session.data?.user.avatar_url}
              referrerPolicy="no-referrer"
              alt={session.data?.user.name}
            />
            <Heading>{nameInHeader}</Heading>
            <SpecialtiesInLineContainer>
              {specialtyInHeader && <Text>{specialtyInHeader}</Text>}
              {subspecialtyInHeader && <Text>- {subspecialtyInHeader}</Text>}
            </SpecialtiesInLineContainer>
          </CalendarUserHeader>

          <label>
            <Text size="sm">Link para agendamentos</Text>
            <TextInput
              prefix="doctoragenda.app/schedule/"
              placeholder="seu-usuário"
              {...register('username')}
            />
            {usernameAlredyTakenMessage && (
              <FormError size="sm">{usernameAlredyTakenMessage}</FormError>
            )}
          </label>

          <label>
            <Text size="sm">Nome completo</Text>
            <TextInput
              placeholder="Seu nome"
              {...register('name')}
              onChange={(e) => setNameInHeader(e.target.value)}
            />
          </label>

          <SpecilatiesContainer>
            <label>
              <Text size="sm">Especialidade</Text>
              <TextInput
                placeholder="Sua especialidade"
                {...register('specialty')}
                onChange={(e) => setSpecialtyInHeader(e.target.value)}
              />
            </label>

            <label>
              <Text size="sm">Subespecialidade</Text>
              <TextInput
                placeholder="Sua subespecialidade"
                {...register('subspecialty')}
                onChange={(e) => setSubspecialtyInHeader(e.target.value)}
              />
            </label>
          </SpecilatiesContainer>

          <Button type="submit" disabled={isSubmitting}>
            Atualizar
          </Button>

          <ElementSeparator></ElementSeparator>

          <Button
            type="button"
            variant="secondary"
            onClick={goToUpdateTimeIntervals}
          >
            Alterar horários para agendamentos
          </Button>
        </ProfileBox>

        <MyCalendarButtonContainer>
          <Button type="button" onClick={goToMyCalendar}>
            Meu calendário
            <Calendar />
          </Button>

          <Button
            type="button"
            variant="tertiary"
            onClick={copyLinkToClipboard}
          >
            Copiar meu link
            <Link />
          </Button>
        </MyCalendarButtonContainer>

        <SubscriptionBox>
          <ChangeSubscriptionStatusContainer>
            {dateSubscriptionPeriodEndsFormatted &&
              !isSubscriptionCancelled && (
                <>
                  <Text size="sm">
                    Próxima cobrança: {dateSubscriptionPeriodEndsFormatted}
                  </Text>
                  <ButtonCancelSubscription
                    variant="tertiary"
                    onClick={cancelStripeSubscription}
                    disabled={changeSubscriptionStatusButton}
                  >
                    Cancelar Assinatura
                  </ButtonCancelSubscription>
                </>
              )}

            {dateSubscriptionPeriodEndsFormatted && isSubscriptionCancelled && (
              <>
                <Text size="sm">
                  Término da assinatura: {dateSubscriptionPeriodEndsFormatted}
                </Text>
                <ButtonSubscribe
                  variant="tertiary"
                  onClick={reactivateStripeSubscription}
                  disabled={changeSubscriptionStatusButton}
                >
                  Reativar assinatura
                </ButtonSubscribe>
              </>
            )}

            {!dateSubscriptionPeriodEndsFormatted && (
              <>
                <Text size="sm">Você não possui uma assinatura ativa</Text>
                <ButtonSubscribe variant="tertiary" onClick={goToPricing}>
                  Assine agora
                </ButtonSubscribe>
              </>
            )}
          </ChangeSubscriptionStatusContainer>
          {dateSubscriptionPeriodEndsFormatted && (
            <Text size="xs">
              * Ao cancelar sua assinatura, não ocorrerá novas cobranças mensais
              automáticas.
            </Text>
          )}
        </SubscriptionBox>

        <LogOutButtonContainer>
          <Button variant="tertiary" onClick={logOut} disabled={signOutClicked}>
            Sair
          </Button>
        </LogOutButtonContainer>
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  // const activeSubscription = await prisma.subscription.findFirst({
  //   where: {
  //     user_id: session?.user.id,
  //     status: 'active',
  //   },
  // })

  const activeSubscription = session?.activeSubscription

  let dateSubscriptionPeriodEndsFormatted = null
  let activeSubscriptionId = null
  let isSubscriptionCancelled = false

  if (activeSubscription) {
    activeSubscriptionId = activeSubscription.id

    const subscription = await stripe.subscriptions.retrieve(
      activeSubscriptionId,
    )
    const subscriptionPeriodEnd = subscription.current_period_end

    isSubscriptionCancelled = subscription.cancel_at_period_end

    const dateSubscriptionPeriodEnds = dayjs.unix(subscriptionPeriodEnd)
    dateSubscriptionPeriodEndsFormatted =
      dateSubscriptionPeriodEnds.format('DD[/]MM[/]YYYY')
  }

  return {
    props: {
      session,
      dateSubscriptionPeriodEndsFormatted,
      activeSubscriptionId,
      isSubscriptionCancelled,
    },
  }
}
