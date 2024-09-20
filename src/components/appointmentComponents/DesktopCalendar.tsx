import React from 'react';
import { Calendar, View, SlotInfo } from 'react-big-calendar';
import { ITimeSlot } from '../../interfaces/ITimeSlot';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Import the default styles
import '../../styles/calendar.css'; // Your custom styles if needed

interface DesktopCalendar {
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

const DesktopCalendar: React.FC<DesktopCalendar> = ({
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
      step={30} // Two-hour intervals for time slots
      timeslots={1} // One timeslot per step
      style={{ height: '90vh', width: '100%' }} // Set full-screen height
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      views={['week']} // Week view
      view={view}
      onView={onView}
      onSelectSlot={onSelectSlot}
      selectable
      onNavigate={onNavigate}
      eventPropGetter={eventPropGetter}
      slotPropGetter={slotPropGetter}
      defaultDate={selectedDate}
      scrollToTime={new Date(1970, 1, 1, 0, 0)} // Start scrolling to midnight
      showMultiDayTimes={false} // Prevents multi-day events from showing in time slots
      className="calendar-container" // Custom class for additional styling
    />
  );
};

export default DesktopCalendar;
