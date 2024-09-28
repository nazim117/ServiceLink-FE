// components/Appointment.jsx or Appointment.tsx

import { useState, useEffect } from 'react';
import CustomCalendar from '../components/appointmentComponents/CustomCalendar';
import BookingModal from '../components/appointmentComponents/BookingModal';
import appointmentAPI from '../API/appointmentAPI';
import { useParams } from 'react-router-dom';
import { ITimeSlot } from '../interfaces/ITimeSlot';
import { IOfferType } from '../interfaces/IOfferType';
import offerAPI from '../API/offerAPI';

function Appointment() {
  const { serviceId, offerId } = useParams();
  const serviceIdnum = Number(serviceId);
  const offerIdnum = Number(offerId);
  
  const [offer, setOffer] = useState<IOfferType | null>(null);
  const [events, setEvents] = useState<ITimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch offer details
  const fetchOffer = async () => {
    try {
      const fetchedOffer = await offerAPI.getOfferById(offerIdnum);
      setOffer(fetchedOffer);
    } catch (error) {
      console.error('Failed to fetch offer details', error);
    }
  };

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
    fetchOffer();
    fetchEvents();
  }, [serviceIdnum, offerIdnum]);

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
    if (!offer) {
      alert('Offer details are not loaded yet. Please try again.');
      return;
    }

    if(!selectedDate){
      alert("Select a date")
      return
    }
  
    try {
      // Construct the appointment data required by your API
      const startDateTime = new Date(selectedDate!);
      console.log("startdatetime ", startDateTime)
      console.log("selectedDate", selectedDate)
      console.log("selectedtime",selectedTime)
      const hours = selectedDate.getHours();
      const minutes = selectedDate.getMinutes();
      startDateTime.setHours(hours, minutes, 0, 0);
  
      const endDateTime = new Date(startDateTime);
      endDateTime.setMinutes(endDateTime.getMinutes() + offer.duration); // Use offer.duration
      console.log("enddate", endDateTime)
      console.log("enddate formula", endDateTime.getMinutes() + offer.duration)

      const appointmentData = {
        start: startDateTime.toUTCString(),
        end: endDateTime.toUTCString(),
        serviceId: serviceIdnum,
        offerId: offerIdnum,
        clientName: bookingData.name,
        clientEmail: bookingData.email,
        description: bookingData.description,
      };
  
      console.log("appointment", appointmentData);
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

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Book an Appointment</h1>
      {!offer ? (
        <p>Loading offer details...</p>
      ) : (
        <>
          <CustomCalendar
            selectedDate={selectedDate}
            onSelectDate={handleDateSelect}
            events={events}
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
        </>
      )}
    </div>
  );
}

export default Appointment;
