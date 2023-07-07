import { Calendar } from '@/components/Calendar'
import { api } from '@/lib/axios'
import { Text } from '@doctor-ui/react'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { X } from 'phosphor-react'
import { useState } from 'react'
import {
  Container,
  TimePicker,
  TimePickerHeader,
  TimePickerText,
  TimePickerItem,
  TimePickerList,
  ConfirmedScheduleContainer,
  XButton,
} from './styles'

interface Availability {
  possibleTimes: number[]
  availableTimes: number[]
}

interface CalendarStepProps {
  onSelectDateTime: (date: Date) => void
  isScheduleConfirmed: Boolean
}

export function CalendarStep({
  onSelectDateTime,
  isScheduleConfirmed,
}: CalendarStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const router = useRouter()

  const isDateSelected = !!selectedDate
  const username = String(router.query.username)

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null
  const describedDate = selectedDate
    ? dayjs(selectedDate).format('DD[ de ] MMMM')
    : null

  const selectedDateWithoutTime = selectedDate
    ? dayjs(selectedDate).format('YYYY-MM-DD')
    : null

  const userTimeZone = new Date().getTimezoneOffset() / 60

  const { data: availability } = useQuery<Availability>(
    ['availability', selectedDateWithoutTime],
    async () => {
      const response = await api.get(`/users/${username}/availability`, {
        params: {
          date: selectedDateWithoutTime,
        },
      })

      return response.data
    },
    {
      enabled: !!selectedDate,
    },
  )

  function handleSelectTime(hour: number) {
    const dateWithTime = dayjs(selectedDate)
      .set('hour', hour)
      .set('minute', Math.round((hour - Math.floor(hour)) * 60))
      .set('second', 0)
      .toDate()

    onSelectDateTime(dateWithTime)
  }

  return (
    <>
      {isScheduleConfirmed && (
        <ConfirmedScheduleContainer>
          <Text>Seu agendamento foi confirmado!</Text>
        </ConfirmedScheduleContainer>
      )}
      <Container isTimePickerOpen={isDateSelected}>
        <Calendar
          selectedDate={selectedDate}
          onDateSelected={setSelectedDate}
        />

        {isDateSelected && (
          <TimePicker>
            <TimePickerHeader>
              <TimePickerText>
                {weekDay}, <span>{describedDate}</span>
              </TimePickerText>
              <XButton type="button" onClick={() => setSelectedDate(null)}>
                <X size="19" />
              </XButton>
            </TimePickerHeader>

            <TimePickerList>
              {availability?.possibleTimes.map((hour) => {
                return (
                  <TimePickerItem
                    key={hour}
                    onClick={() => handleSelectTime(hour)}
                    disabled={
                      !availability.availableTimes.includes(hour - userTimeZone)
                    }
                  >
                    {String(Math.floor(hour)).padStart(2, '0')}:
                    {String(
                      Math.round((hour - Math.floor(hour)) * 60),
                    ).padStart(2, '0')}
                  </TimePickerItem>
                )
              })}
            </TimePickerList>
          </TimePicker>
        )}
      </Container>
    </>
  )
}
