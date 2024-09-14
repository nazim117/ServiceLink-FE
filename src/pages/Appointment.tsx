import React, { useState, useEffect, Fragment, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { momentLocalizer, View, SlotInfo } from 'react-big-calendar';
import moment from 'moment';
import 'moment-timezone';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import appointmentAPI from '../API/appointmentAPI';
import { ITimeSlot } from '../interfaces/ITimeSlot';
import { DateTime } from 'luxon';
import {Notification} from "../components/Notification"
import AppointmentCalendar from '../components/appointmentComponents/AppointmentCalendar';
import BookingModal from '../components/appointmentComponents/BookingModal';

const localizer = momentLocalizer(moment);

function Appointment() {
  const { serviceId, offerId } = useParams();
  const serviceIdnum = Number(serviceId);
  const offerIdnum = Number(offerId);
  const [view, setView] = useState<View>('week');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeSlots, setTimeSlots] = useState<ITimeSlot[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<ITimeSlot | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const OCCUPIED_SLOT_COLOR = '#ff6961';
  const AVAILABLE_SLOT_COLOR = '#77dd77';

  useEffect(() => {
    if (selectedDate && view === 'week') {
      fetchTimeSlots(selectedDate);
    }
  }, [selectedDate, view]);

  const fetchTimeSlots = async (date: Date) => {
    setLoading(true)
    try {
      const response = await appointmentAPI.getAllAppointments(serviceIdnum);
      const slots = response.filter((slot: any) => {
        const slotStartDate = DateTime.fromISO(slot.startDate, { zone: 'utc' }).toLocal();
        return (
          slotStartDate.year === date.getFullYear() &&
          slotStartDate.month === date.getMonth() + 1 &&
          slotStartDate.day === date.getDate()
        );
      });
  
      setTimeSlots(
        slots.map((slot: any) => ({
          start: DateTime.fromISO(slot.startDate, { zone: 'utc' }).toLocal().toJSDate(),
          end: DateTime.fromISO(slot.endDate, { zone: 'utc' }).toLocal().toJSDate(),
          occupied: true,
        }))
      );
    } catch (error) {
      console.error('Failed to fetch time slots', error);
      alert('An error occurred while opening calendar. Please try again.');
    } finally{
        setLoading(false)
    }
  };

  const handleSelectSlot = useCallback((slotInfo: SlotInfo) => {
    if (moment(slotInfo.start).isBefore(moment())) {
      return; // Ignore past slots
    }
  
    // Check for overlap with occupied slots
    const isOverlapping = timeSlots.some((slot) =>
      moment(slot.start).isBefore(slotInfo.end) && moment(slot.end).isAfter(slotInfo.start)
    );
  
    if (isOverlapping) {
      alert('This time slot is already occupied.');
      return;
    }
  
    setSelectedSlot({
      start: slotInfo.start,
      end: slotInfo.end,
      occupied: false,
    });
    setIsModalOpen(true);
  }, [timeSlots]);

  const handleNavigate = (date: Date) => {
    if (moment(date).isBefore(moment(), 'day')) {
      // Prevent navigation to past dates
      setSelectedDate(new Date());
    } else {
      setSelectedDate(date);
    }
  };

  const handleViewChange = (newView: View) => {
    setView(newView);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    if (selectedSlot) {
      try {
        const appointment = {
          startDate: selectedSlot.start,
          endDate: selectedSlot.end,
          serviceId: serviceIdnum,
          offerId: offerIdnum,
          clientName: name,
          clientEmail: email,
          description, // Include the offer description
        };
        await appointmentAPI.createAppointment(appointment);
        setBookingSuccess(true);
        {bookingSuccess && <Notification message="Appointment booked successfully!" />}
        handleCloseModal();
      } catch (error) {
        console.error('Failed to book appointment', error);
        alert('An error occurred while booking your appointment. Please try again.');

      }
    }
  };

  const eventPropGetter = (event: ITimeSlot) => ({
    style: { backgroundColor: event.occupied ? OCCUPIED_SLOT_COLOR  : AVAILABLE_SLOT_COLOR  },
  });

  const slotPropGetter = (date: Date): React.HTMLAttributes<HTMLDivElement> => {
    if (moment(date).isBefore(moment())) {
      return {
        className: 'rbc-slot-past',
        style: {
          pointerEvents: 'none',
          backgroundColor: '#f0f0f0',
          color: '#d3d3d3',
        },
      };
    } else {
      return {};
    }
  };

  return (
    <div className="appointment-page min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <h1 className="text-3xl font-semibold text-gray-700 mb-8">Book an Appointment</h1>
      {loading ? (
        <div>Loading...</div>
      ): (
        <AppointmentCalendar
        localizer={localizer}
        events={timeSlots}
        view={view}
        onView={handleViewChange}
        onSelectSlot={handleSelectSlot}
        onNavigate={handleNavigate}
        eventPropGetter={eventPropGetter}
        slotPropGetter={slotPropGetter}
        selectedDate={selectedDate}
        loading={loading}
      />)
      }
      
      <BookingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedSlot={selectedSlot}
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        description={description}
        setDescription={setDescription}
        handleFormSubmit={handleFormSubmit}
      />
      {bookingSuccess && <Notification message="Appointment booked successfully!" />}
    </div>
  );
}

export default Appointment;
