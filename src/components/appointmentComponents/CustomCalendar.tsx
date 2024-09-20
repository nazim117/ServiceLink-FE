import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import MobileCalendar from './MobileCalendar';
import DesktopCalendar from './DesktopCalendar';
import "../../styles/calendar.css"; // Ensure correct path
import { ITimeSlot } from '@/src/interfaces/ITimeSlot';
import localizer from '../../utils/localizer'; // Import the localizer we set up

import { View, Views, SlotInfo } from 'react-big-calendar';
import { DateSelectArg, EventApi } from '@fullcalendar/core';

interface CustomCalendarProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  events: ITimeSlot[];
  className?: string;
  loading?: boolean;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  selectedDate,
  onSelectDate,
  events,
  className,
  loading = false,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [view, setView] = useState<'timeGridWeek' | 'timeGridDay' | 'dayGridMonth'>('timeGridWeek');
  const [viewDesktop, setViewDesktop] = useState<View>(Views.WEEK);
  const [currentDate, setCurrentDate] = useState<Date>(selectedDate || new Date());

  const handleViewChange = (newView: 'timeGridWeek' | 'timeGridDay' | 'dayGridMonth') => {
    setView(newView);
  };

  const handleViewChangeDesktop = (newView: View) => {
    setViewDesktop(newView);
  };

  const handleNavigate = (date: Date) => {
    setCurrentDate(date);
    onSelectDate(date);
  };

  const handleSelectSlot = (slotInfo: DateSelectArg) => {
    onSelectDate(slotInfo.start);
  };

  const handleSelectSlotDesktop = (slotInfo: SlotInfo) => {
    onSelectDate(slotInfo.start);
  };

  const eventPropGetter = (event: EventApi) => ({
    style: {
      backgroundColor: '#1976d2',
      color: 'white',
      borderRadius: '5px',
      border: 'none',
    },
  });

  const eventPropGetterDesktop = (event: ITimeSlot) => ({
    style: {
      backgroundColor: '#1976d2',
      color: 'white',
      borderRadius: '5px',
      border: 'none',
    },
  });

  const slotPropGetter = (date: Date) => ({
    style: {
      backgroundColor: '#f0f0f0',
    },
  });

  return (
    <div className={className}>
      {isMobile ? (
        <MobileCalendar
          events={events}
          view={view}
          onView={handleViewChange}
          onSelectSlot={handleSelectSlot}
          onNavigate={handleNavigate}
          eventPropGetter={eventPropGetter}
          slotPropGetter={slotPropGetter}
          selectedDate={currentDate}
          loading={loading}
        />
      ) : (
        <DesktopCalendar
          localizer={localizer}
          events={events}
          view={viewDesktop}
          onView={handleViewChangeDesktop}
          onSelectSlot={handleSelectSlotDesktop}
          onNavigate={handleNavigate}
          eventPropGetter={eventPropGetterDesktop}
          slotPropGetter={slotPropGetter}
          selectedDate={currentDate}
          loading={loading}
        />
      )}
    </div>
  );
};

export default CustomCalendar;