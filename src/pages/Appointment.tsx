// components/Appointment.jsx or Appointment.tsx

import React, { useState, useEffect } from 'react';
import CustomCalendar from '../components/appointmentComponents/CustomCalendar';
import BookingModal from '../components/appointmentComponents/BookingModal';
import appointmentAPI from '../API/appointmentAPI';
import { useParams } from 'react-router-dom';
import { ITimeSlot } from '../interfaces/ITimeSlot';

function Appointment() {
  const { serviceId, offerId } = useParams();
  const serviceIdnum = Number(serviceId);
  const offerIdnum = Number(offerId);
  const [events, setEvents] = useState<ITimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch existing appointments
  const fetchEvents = async () => {
    try {
      const appointments = await appointmentAPI.getAllAppointments(serviceIdnum);
      setEvents(appointments);
    } catch (error) {
      console.error('Failed to fetch appointments', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [serviceIdnum]);

  const handleDateSelect = (date: Date | undefined) => {
    console.log("Date selected: ", date); // Debug log
  
    if (!date) {
      console.log("No valid date selected.");
      return;
    }
  
    const now = new Date();
    const selectedDateMidnight = new Date(date);
    selectedDateMidnight.setHours(0, 0, 0, 0);
    const todayMidnight = new Date(now);
    todayMidnight.setHours(0, 0, 0, 0);
  
    if (selectedDateMidnight < todayMidnight) {
      alert('Cannot select past dates.');
      return;
    }
  
    setSelectedDate(date);
    setSelectedTime(undefined);
    setIsModalOpen(true);
  };  

  // Handle booking submission from the modal
  const handleBookingSubmit = async (bookingData: any) => {
    try {
      // Construct the appointment data required by your API
      const startDateTime = new Date(selectedDate!);
      const [hours, minutes] = selectedTime!.split(':').map(Number);
      startDateTime.setHours(hours, minutes, 0, 0);

      const endDateTime = new Date(startDateTime);
      endDateTime.setMinutes(endDateTime.getMinutes() + 30); // Assuming each appointment is 30 mins

      const appointmentData = {
        start: startDateTime,
        end: endDateTime,
        serviceId: serviceIdnum,
        offerId: offerIdnum, // Adjust this based on your logic
        clientName: bookingData.name,
        clientEmail: bookingData.email,
        description: bookingData.description,
      };

      // Call the API to create the appointment
      await appointmentAPI.createAppointment(appointmentData);

      // Close the modal
      setIsModalOpen(false);

      // Clear selected date and time
      setSelectedDate(undefined);
      setSelectedTime(undefined);

      // Refresh the events to include the new appointment
      fetchEvents();

      alert('Appointment booked successfully!');
    } catch (error) {
      console.error('Failed to book appointment', error);
      alert('Failed to book appointment. Please try again.');
    }
  };

  // Calculate disabled days (e.g., fully booked days)
  const disabledDays = events.reduce((acc, event) => {
    const eventDate = new Date(event.start);
    const eventDateMidnight = new Date(eventDate);
    eventDateMidnight.setHours(0, 0, 0, 0);

    if (acc.some(date => date.toDateString() === eventDateMidnight.toDateString())) {
      return acc;
    }
    return [...acc, eventDateMidnight];
  }, [] as Date[]);

  return (
    <div className="p-4 max-w-4xl mx-auto"> {/* Adjusted max width for larger screens */}
      <h1 className="text-2xl font-bold mb-4 text-center">Book an Appointment</h1>
      <CustomCalendar
        selectedDate={selectedDate}
        onSelectDate={handleDateSelect}
        events={events} // Pass events to CustomCalendar
        className="mb-4"
      />
      {isModalOpen && selectedDate && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onTimeSelect={setSelectedTime}
          onSubmit={handleBookingSubmit}
          events={events}
        />
      )}
    </div>
  );
}

export default Appointment;
