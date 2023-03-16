import { useState } from 'react'
import { CalendarStep } from './CalendarStep'
import { ConfirmStep } from './ConfirmStep'

export function ScheduleForm() {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>()
  const [scheduleConfirmed, setScheduleConfirmed] = useState(false)

  function handleClearSelectedDateTime() {
    setSelectedDateTime(null)
  }

  function handleConfirmedSchedule() {
    setSelectedDateTime(null)
    setScheduleConfirmed(true)
  }

  if (selectedDateTime) {
    return (
      <ConfirmStep
        schedulingDate={selectedDateTime}
        onCancelConfirmation={handleClearSelectedDateTime}
        onConfirmSchedule={handleConfirmedSchedule}
      />
    )
  }

  return (
    <CalendarStep
      onSelectDateTime={setSelectedDateTime}
      isScheduleConfirmed={scheduleConfirmed}
    />
  )
}
