import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { NextApiRequest, NextApiResponse } from 'next'
import dayjs from 'dayjs'
import { google } from 'googleapis'
import { getGoogleOAuthToken } from '@/lib/google'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const username = String(req.query.username)

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(400).json({ message: 'User does not exist.' })
  }

  const createSchedulingBody = z.object({
    name: z.string(),
    email: z.string(),
    cellNumber: z.string(),
    observations: z.string(),
    date: z.string().datetime(),
    userTimeZone: z.number(),
  })

  const appointment = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
    },
  })

  if (!appointment) {
    return res
      .status(400)
      .json({ message: 'This Doctor does not have appointment time.' })
  }

  const appointmentInterval = appointment.appointment_time

  const { name, email, cellNumber, observations, date, userTimeZone } =
    createSchedulingBody.parse(req.body)

  const schedulingDate = dayjs(date)

  if (schedulingDate.isBefore(new Date())) {
    return res.status(400).json({
      message: 'Date is in the past.',
    })
  }

  const conflictingScheduling = await prisma.scheduling.findFirst({
    where: {
      user_id: user.id,
      date: schedulingDate.toDate(),
    },
  })

  if (conflictingScheduling) {
    return res.status(400).json({
      message: 'There is another scheduling at the same time.',
    })
  }

  await prisma.scheduling.create({
    data: {
      name,
      email,
      cellNumber,
      observations,
      date: schedulingDate.subtract(userTimeZone, 'hour').toDate(),
      user_id: user.id,
    },
  })

  const calendar = google.calendar({
    version: 'v3',
    auth: await getGoogleOAuthToken(user.id),
  })

  const scheduleDay = schedulingDate.date()
  const scheduleMonth = schedulingDate.month()
  const scheduleYear = schedulingDate.year()
  let scheduleMinutes = schedulingDate.minute() + appointmentInterval
  let scheduleHours = schedulingDate.hour()

  if (scheduleMinutes >= 60) {
    scheduleHours += Math.floor(scheduleMinutes / 60)
  }

  scheduleMinutes = scheduleMinutes % 60

  const finalEndDateTime = dayjs()
    .date(scheduleDay)
    .month(scheduleMonth)
    .year(scheduleYear)
    .hour(scheduleHours)
    .minute(scheduleMinutes)

  await calendar.events.insert({
    calendarId: 'primary',
    requestBody: {
      summary: `Doctor Agenda: ${name}`,
      description: `Email: ${email} \nNúmero de celular: ${cellNumber} \nObservações: ${observations}`,
      start: {
        dateTime: schedulingDate.format(),
      },
      end: {
        // dateTime: schedulingDate.add(1, 'hour').format(),
        dateTime: finalEndDateTime.format(),
      },
      // attendees: [{ email, displayName: name }],
    },
  })

  return res.status(201).end()
}
