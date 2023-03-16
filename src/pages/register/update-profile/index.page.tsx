import { api } from '@/lib/axios'
import { buildNextAuthOptions } from '@/pages/api/auth/[...nextauth].api'
import {
  Avatar,
  Button,
  Heading,
  MultiStep,
  Text,
  TextInput,
} from '@doctor-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { ArrowRight } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Container, Header } from '../styles'
import {
  FormError,
  ProfileBox,
  SpecilatiesContainer,
  CalendarUserHeader,
  SpecialtiesInLineContainer,
} from './styles'

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

export default function UpdateProfile() {
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

  const [nameInHeader, setNameInHeader] = useState(session.data?.user.name)
  const [specialtyInHeader, setSpecialtyInHeader] = useState(
    session.data?.user.specialty,
  )
  const [subspecialtyInHeader, setSubspecialtyInHeader] = useState(
    session.data?.user.subspecialty,
  )

  useEffect(() => {
    setValue(
      'username',
      session.data?.user.username ? session.data.user.username : '',
    )

    setValue('name', session.data?.user.name ? session.data.user.name : '')
  }, [setValue, session.data?.user.username, session.data?.user.name])

  async function handleUpdateProfile(data: UpdateProfileData) {
    try {
      await api.put('/users/profile', {
        username: data.username,
        name: data.name,
        specialty: data.specialty,
        subspecialty: data.subspecialty,
      })
      await router.push(`/register/pricing`)
    } catch (err) {
      if (err instanceof AxiosError && err?.response?.data?.message) {
        setusernameAlredyTakenMessage('Esse nome de usuário já está em uso.')
        return
      }
      console.error(err)
    }
  }

  return (
    <>
      <NextSeo title="Atualize seu perfil | Doctor Agenda" noindex />

      <Container>
        <Header>
          <Heading as="strong">Defina a sua especialidade</Heading>
          <Text>
            Se possuir especialidade e subespecialidade, coloque-as aqui. Se
            quiser, também pode alterar seu nome de usuário e o seu nome. Esses
            dados também podem ser atualizados mais tarde.
          </Text>

          <MultiStep size={5} currentStep={4} />
        </Header>

        <ProfileBox as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
          {/* <AvatarImgContainer>
            <Text size="sm">Foto de perfil</Text>
            <Avatar
              src={session.data?.user.avatar_url}
              referrerPolicy="no-referrer"
              alt={session.data?.user.name}
            />
          </AvatarImgContainer> */}

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
            Próximo passo
            <ArrowRight />
          </Button>
        </ProfileBox>
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

  return {
    props: {
      session,
    },
  }
}
