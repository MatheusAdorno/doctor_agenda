import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const username = String(req.query.username)
  const { date, userTimeZone } = req.query

  if (!date) {
    return res.status(400).json({ message: 'Date not provided.' })
  }

  if (!userTimeZone) {
    return res.status(400).json({ message: 'User Time Zone not provided.' })
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(400).json({ message: 'User does not exist.' })
  }

  const referenceDate = dayjs(String(date))
  const isPastDate = referenceDate.endOf('day').isBefore(new Date())

  if (isPastDate) {
    return res.json({ possibleTimes: [], availableTimes: [] })
  }

  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.get('day'),
    },
  })

  if (!userAvailability) {
    return res.json({ possibleTimes: [], availableTimes: [] })
  }

  // Lembrar de modificar isso após modificação na regra de negocio da aplicação, quando usuário puder escolher o intervalo dos agendamentos
  const { time_start_in_minutes, time_end_in_minutes, appointment_time } =
    userAvailability

  const startHour = time_start_in_minutes / 60
  const endHour = time_end_in_minutes / 60

  const moduleStartHour = time_start_in_minutes % 60
  const moduleEndHour = time_start_in_minutes % 60

  let decimalPartStartHour = 0
  let decimalPartEndHour = 0

  if (moduleStartHour !== 0) {
    decimalPartStartHour = startHour - Math.floor(startHour)
  }

  if (moduleEndHour !== 0) {
    decimalPartEndHour = endHour - Math.floor(endHour)
  }

  const startMinutes = decimalPartStartHour * 60
  const endMinutes = decimalPartEndHour * 60

  const appointmentTimeInfluenceInPossibleTimesLength = 60 / appointment_time
  const possibleTimesLength = Math.floor(
    (endHour - startHour) * appointmentTimeInfluenceInPossibleTimesLength,
  )

  const possibleTimes = Array.from({ length: possibleTimesLength }).map(
    (_, i) => {
      return startHour + i * (appointment_time / 60)
    },
  )

  const blockedTimes = await prisma.scheduling.findMany({
    select: {
      date: true,
    },
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate
          .set('hour', startHour)
          .set('minute', startMinutes)
          .toDate(),
        lte: referenceDate
          .set('hour', endHour)
          .set('minute', endMinutes)
          .toDate(),
      },
    },
  })

  const availableTimes = possibleTimes.filter((time) => {
    const isTimeBlocked = blockedTimes.some(
      (blockedTime) =>
        blockedTime.date.getHours() === Math.floor(time) &&
        blockedTime.date.getMinutes() ===
          Math.round((time - Math.floor(time)) * 60),
      // blockedTime.date.getHours() === Math.floor(time) &&
      // blockedTime.date.getMinutes() / 60 === time - Math.floor(time),
    )
    // console.log('Hour Blocked:' + blockedTimes[0].date.getHours())
    // console.log('Time: ' + Math.floor(time))
    // console.log('Minutes Blocked:' + blockedTimes[0].date.getMinutes())
    // console.log('Minutes:' + [Math.round((time - Math.floor(time)) * 60)])
    // console.log(
    //   'Minutes is Equal: ' +
    //     [
    //       blockedTimes[0].date.getMinutes() ===
    //         Math.round((time - Math.floor(time)) * 60),
    //     ],
    // )
    // console.log(
    //   'Time is Equal: ' +
    //     [
    //       blockedTimes[0].date.getHours() === Math.floor(time) &&
    //         blockedTimes[0].date.getMinutes() ===
    //           Math.round((time - Math.floor(time)) * 60),
    //     ],
    // )
    // console.log('________________')

    const minutes = (time - Math.floor(time)) * 60

    const isTimeInPast = referenceDate
      .set('hour', time - Number(userTimeZone))
      .set('minute', minutes)
      .isBefore(new Date())

    return !isTimeBlocked && !isTimeInPast
  })

  return res.json({
    possibleTimes,
    availableTimes,
  })
}
