import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar, momentLocalizer, View, SlotInfo } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import appointmentAPI from '../API/appointmentAPI';
import { IAppointmentType } from '../interfaces/IAppointmentType';

const localizer = momentLocalizer(moment);

interface TimeSlot {
  start: Date;
  end: Date;
  occupied: boolean;
}

interface IOfferType {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
  imagePath: string;
}

function Appointment() {
  const location = useLocation();
  const offer = location.state?.offer as IOfferType;

  const [view, setView] = useState<View>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [showBookingForm, setShowBookingForm] = useState<boolean>(false);
  const [bookingDetails, setBookingDetails] = useState<{ clientName: string; clientEmail: string; startTime: string }>({
    clientName: '',
    clientEmail: '',
    startTime: ''
  });
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  useEffect(() => {
    if (selectedDate) {
      fetchTimeSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchTimeSlots = async (date: Date) => {
    try {
      const response = await appointmentAPI.getAllAppointments();
      console.log("response: ", response);
      console.log("date:", date);
  
      // Filter appointments that match the specific date
      const slots = response.filter((slot: any) => {
        const slotStartDate = new Date(slot.startDate);
        return (
          slotStartDate.getFullYear() === date.getFullYear() &&
          slotStartDate.getMonth() === date.getMonth() &&
          slotStartDate.getDate() === date.getDate()
        );
      });
  
      console.log("slot: ", slots);
  
      setTimeSlots(
        slots.map((slot: any) => ({
          start: new Date(slot.startDate),
          end: new Date(slot.endDate),
          occupied: true // Assuming all fetched slots are occupied
        }))
      );
    } catch (error) {
      console.error('Failed to fetch time slots', error);
    }
  };
  

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    const selectedDate = moment(slotInfo.start).startOf('day').toDate();
    setSelectedDate(selectedDate);
    setSelectedSlot({ start: slotInfo.start, end: slotInfo.end, occupied: false });
    setShowBookingForm(true);
  };

  const handleNavigate = (date: Date) => {
    if (view === 'day') {
      setSelectedDate(moment(date).startOf('day').toDate());
    }
  };

  const handleViewChange = (newView: View) => {
    setView(newView);
  };

  const handleBookingInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookingDetails({ ...bookingDetails, [name]: value });
  };

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedDate && bookingDetails.startTime) {
      const startDateTime = moment(selectedDate).set({
        hour: parseInt(bookingDetails.startTime.split(':')[0], 10),
        minute: parseInt(bookingDetails.startTime.split(':')[1], 10)
      }).toDate();
      const endDateTime = moment(startDateTime).add(offer.duration, 'minutes').toDate();

      try {
        const newAppointment: IAppointmentType = {
          startDate: startDateTime,
          endDate: endDateTime,
          serviceId: offer.id, // Assuming serviceId is offer.id, adjust if necessary
          offerId: offer.id,
          clientName: bookingDetails.clientName,
          clientEmail: bookingDetails.clientEmail,
          description: offer.description
        };
        await appointmentAPI.createAppointment(newAppointment);
        setShowBookingForm(false);
        fetchTimeSlots(selectedDate); // Refresh the slots
      } catch (error) {
        console.error('Failed to create appointment', error);
      }
    }
  };

  const eventPropGetter = (event: TimeSlot) => {
    const backgroundColor = event.occupied ? '#ff6961' : '#77dd77'; // Red for occupied, green for free
    return { style: { backgroundColor } };
  };

  return (
    <div className="appointment-page">
      <Calendar
        localizer={localizer}
        events={timeSlots}
        startAccessor="start"
        endAccessor="end"
        views={['month', 'day']}
        view={view}
        onView={handleViewChange}
        onSelectSlot={handleSelectSlot}
        selectable
        onNavigate={handleNavigate}
        eventPropGetter={eventPropGetter}
        style={{ height: 500 }}
      />
      {showBookingForm && (
        <div className="booking-form">
          <h2>Book Appointment for {offer.name}</h2>
          <form onSubmit={handleBookingSubmit}>
            <div>
              <label>Name:</label>
              <input type="text" name="clientName" value={bookingDetails.clientName} onChange={handleBookingInputChange} required />
            </div>
            <div>
              <label>Email:</label>
              <input type="email" name="clientEmail" value={bookingDetails.clientEmail} onChange={handleBookingInputChange} required />
            </div>
            <div>
              <label>Start Time:</label>
              <input type="time" name="startTime" value={bookingDetails.startTime} onChange={handleBookingInputChange} required />
            </div>
            <button type="submit">Book</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Appointment;
