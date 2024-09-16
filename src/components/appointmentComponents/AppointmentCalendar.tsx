// src/components/appointmentComponents/AppointmentCalendar.tsx

"use client"

import { Calendar } from "../ui/calendar"

interface AppointmentCalendarProps {
  selectedDate: Date | undefined
  onSelectDate: (date: Date | undefined) => void
}

function AppointmentCalendar({ selectedDate, onSelectDate }: AppointmentCalendarProps) {
  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={onSelectDate}
      className="rounded-md border"
    />
  )
}

export default AppointmentCalendar;
