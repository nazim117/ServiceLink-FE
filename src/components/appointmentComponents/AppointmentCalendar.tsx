import React from 'react';
import { Calendar, View, SlotInfo } from 'react-big-calendar';
import { ITimeSlot } from '../../interfaces/ITimeSlot';
import '../../styles/calendar.css';

interface AppointmentCalendarProps {
  localizer: any;
  events: ITimeSlot[];
  view: View;
  onView: (view: View) => void;
  onSelectSlot: (slotInfo: SlotInfo) => void;
  onNavigate: (date: Date) => void;
  eventPropGetter: (event: ITimeSlot) => object;
  slotPropGetter: (date: Date) => object;
  selectedDate: Date;
  loading: boolean;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  localizer,
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
  return loading ? (
    <div>Loading...</div>
  ) : (
    <Calendar
      min={new Date()}
      timeslots={1}
      style={{ height: '70vh', width: '100%' }}
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      views={['week']}
      view={view}
      onView={onView}
      onSelectSlot={onSelectSlot}
      selectable
      onNavigate={onNavigate}
      eventPropGetter={eventPropGetter}
      slotPropGetter={slotPropGetter}
      longPressThreshold={10}
      scrollToTime={new Date()}
      defaultDate={selectedDate}
      className="rounded-lg shadow-md bg-white p-4"
    />

  );
};

export default AppointmentCalendar;
