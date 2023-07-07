import { api } from '@/lib/axios'
import { Button, Text, TextArea, TextInput } from '@doctor-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { CalendarBlank, Clock } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import validator from 'validator'
import {
  ConfirmForm,
  FormActions,
  FormError,
  FormHeader,
  ObservationText,
} from './styles'

const confirmFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'O nome precisa ter no mínimo 3 caracteres.' }),
  cellNumber: z
    .string()
    .min(11, {
      message: 'O número de celular precisa ter no mínimo 11 caracteres.',
    })
    .refine((cellNumber) => validator.isMobilePhone(cellNumber, 'pt-BR'), {
      message:
        'Digite o número de celular seguindo o formato correto. Ex: (11)99999-9999',
    }),
  observations: z.string().nullable(),
})

type ConfirmFormData = z.infer<typeof confirmFormSchema>

interface ConfirmStepProps {
  schedulingDate: Date
  onCancelConfirmation: () => void
  onConfirmSchedule: () => void
}

export function ConfirmStep({
  schedulingDate,
  onCancelConfirmation,
  onConfirmSchedule,
}: ConfirmStepProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ConfirmFormData>({
    resolver: zodResolver(confirmFormSchema),
  })

  // const userTimeZone = new Date().getTimezoneOffset() / 60

  const router = useRouter()
  const username = String(router.query.username)

  async function handleConfirmScheduling(data: ConfirmFormData) {
    const { name, cellNumber, observations } = data

    await api.post(`/users/${username}/schedule`, {
      name,
      cellNumber,
      observations,
      date: schedulingDate,
    })

    onConfirmSchedule()
  }

  const describedDate = dayjs(schedulingDate).format('DD[ de ]MMMM[ de ]YYYY')
  const describedTime = dayjs(
    schedulingDate.setHours(schedulingDate.getHours()),
  ).format('HH:mm[h]')

  return (
    <ConfirmForm as="form" onSubmit={handleSubmit(handleConfirmScheduling)}>
      <FormHeader>
        <Text>
          <CalendarBlank />
          {describedDate}
        </Text>
        <Text>
          <Clock />
          {describedTime}
        </Text>
      </FormHeader>

      <label>
        <Text size="sm">Nome completo</Text>
        <TextInput placeholder="Seu nome" {...register('name')} />
        {errors.name && <FormError size="sm">{errors.name.message}</FormError>}
      </label>

      <label>
        <ObservationText size="sm">
          Número de celular <span>(dd)xxxxx-yyyy</span>
        </ObservationText>
        <TextInput
          type="tel"
          placeholder="Seu WhatsApp"
          {...register('cellNumber')}
        />
        {errors.cellNumber && (
          <FormError size="sm">{errors.cellNumber.message}</FormError>
        )}
      </label>

      <label>
        <ObservationText size="sm">
          <>
            Observações <span>(opcional)</span>
          </>
        </ObservationText>
        <TextArea {...register('observations')} />
      </label>

      <FormActions>
        <Button type="button" variant="tertiary" onClick={onCancelConfirmation}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Confirmar
        </Button>
      </FormActions>
    </ConfirmForm>
  )
}
