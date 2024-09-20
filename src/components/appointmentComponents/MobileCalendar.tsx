import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import { EventInput, DateSelectArg, EventClickArg, EventApi, AllowFunc } from '@fullcalendar/core'
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { ITimeSlot } from '@/src/interfaces/ITimeSlot';

interface MobileCalendarProps {
  events: ITimeSlot[];
  view: 'timeGridWeek' | 'timeGridDay' | 'dayGridMonth';
  onView: (view: 'timeGridWeek' | 'timeGridDay' | 'dayGridMonth') => void;
  onSelectSlot: (slotInfo: DateSelectArg) => void;
  onNavigate: (date: Date) => void;
  eventPropGetter: (event: EventApi) => { style: React.CSSProperties };
  slotPropGetter: (date: Date) => { style: React.CSSProperties };
  selectedDate: Date;
  loading: boolean;
}

const MobileCalendar: React.FC<MobileCalendarProps> = ({
  events,
  view,
  onView,
  onSelectSlot,
  onNavigate,
  eventPropGetter,
  slotPropGetter,
  selectedDate,
  loading,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(selectedDate || new Date());

  useEffect(() => {
    if (!timeGridPlugin || !dayGridPlugin || !interactionPlugin) {
      setError('One or more required plugins are not loaded correctly.');
    }
    if (selectedDate) {
      setCurrentDate(selectedDate);
    }
  }, [selectedDate]);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    onSelectSlot(selectInfo);
  };

  const handleDateClick = (clickInfo: DateClickArg) => {
    const duration = 30; // minutes
    const end = new Date(clickInfo.date.getTime() + duration * 60000);
    const selectInfo: DateSelectArg = {
      startStr: clickInfo.date.toISOString(),
      endStr: end.toISOString(),
      start: clickInfo.date,
      end: end,
      allDay: false,
      view: clickInfo.view,
      jsEvent: clickInfo.jsEvent,
    };
    onSelectSlot(selectInfo);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    // Handle event click if needed
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mobile-calendar">
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin, dayGridPlugin]}
        initialView={view}
        views={{
          timeGridWeek: {
            type: 'timeGrid',
            duration: { weeks: 1 },
            buttonText: 'Week'
          },
          timeGridDay: {
            type: 'timeGrid',
            duration: { days: 1 },
            buttonText: 'Day'
          },
          dayGridMonth: {
            type: 'dayGrid',
            duration: { months: 1 },
            buttonText: 'Month'
          }
        }}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridWeek',
        }}
        selectable={true}
        selectMirror={true}
        selectLongPressDelay={100}
        selectMinDistance={5}
        select={handleDateSelect}
        dateClick={handleDateClick}
        events={events}
        eventClick={handleEventClick}
        eventContent={(arg) => (
          <div style={eventPropGetter(arg.event).style}>
            {arg.event.title}
          </div>
        )}
        slotLabelContent={(arg) => (
          <div style={slotPropGetter(arg.date).style}>
            {arg.text}
          </div>
        )}
        editable={false}
        dayMaxEvents={true}
        height="auto"
        aspectRatio={1.5}
        initialDate={currentDate}
        datesSet={(dateInfo) => onNavigate(dateInfo.start)}
        viewDidMount={(viewInfo) => onView(viewInfo.view.type as 'timeGridWeek')}
      />
    </div>
  );
};

export default MobileCalendar;