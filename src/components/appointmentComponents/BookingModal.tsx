// src/components/appointmentComponents/BookingModal.tsx

import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import moment from 'moment';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  selectedTime: string | undefined;
  onTimeSelect: (time: string | undefined) => void;
  onSubmit: (bookingData: any) => Promise<void>;
  events: any[]; // Adjust the type based on your ITimeSlot interface
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  selectedTime,
  onTimeSelect,
  onSubmit,
  events,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]); // Available time slots

  useEffect(() => {
    // Generate available time slots for the selected date
    const generateTimeSlots = () => {
      const times: string[] = [];
      const startHour = 9; // Business start time
      const endHour = 17; // Business end time

      for (let hour = startHour; hour < endHour; hour++) {
        times.push(`${hour.toString().padStart(2, '0')}:00`);
        times.push(`${hour.toString().padStart(2, '0')}:30`);
      }

      // Remove time slots that are already occupied
      const occupiedTimes = events
        .filter(event => {
          const eventStart = new Date(event.start);
          return (
            eventStart.toDateString() === selectedDate.toDateString()
          );
        })
        .map(event => {
          const eventStart = new Date(event.start);
          return moment(eventStart).format('HH:mm');
        });

      const filteredTimes = times.filter(time => !occupiedTimes.includes(time));
      setAvailableTimes(filteredTimes);
    };

    generateTimeSlots();
  }, [selectedDate, events]);

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form submitted with:', { name, email, description, selectedTime }); // Debugging

    // Validate email
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (!selectedTime) {
      alert('Please select a time slot.');
      return;
    }

    const bookingData = {
      name,
      email,
      description,
    };

    await onSubmit(bookingData);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={onClose}>
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black opacity-30" />
          </Transition.Child>

          {/* This element is to center the modal */}
          <span className="inline-block h-screen align-middle">&#8203;</span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                Book Appointment
              </Dialog.Title>
              <p className="text-sm text-gray-500 mt-2">
                {moment(selectedDate).format('MMM DD, YYYY')}
              </p>

              {/* Time Selection */}
              <div className="mt-4">
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                  Select Time
                </label>
                <select
                  id="time"
                  value={selectedTime}
                  onChange={(e) => onTimeSelect(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">-- Select a time slot --</option>
                  {availableTimes.length > 0 ? (
                    availableTimes.map((time) => (
                      <option key={time} value={time}>
                        {moment(time, 'HH:mm').format('h:mm A')}
                      </option>
                    ))
                  ) : (
                    <option disabled>No available time slots</option>
                  )}
                </select>
              </div>

              <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    More information (optional)
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  ></textarea>
                </div>
                <div className="mt-6 space-y-4">
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-150 ease-in-out"
                  >
                    Book Appointment
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Cancel booking"
                    className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-150 ease-in-out"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
    );

};

export default BookingModal;
