import React, { useState, useEffect, Fragment } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Calendar, momentLocalizer, View, SlotInfo } from 'react-big-calendar';
import moment from 'moment';
import 'moment-timezone';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import appointmentAPI from '../API/appointmentAPI';
import { ITimeSlot } from '../interfaces/ITimeSlot';
import { IOfferType } from '../interfaces/IOfferType';
import { Dialog, Transition } from '@headlessui/react'; // Import Dialog and Transition from Headless UI
import '../styles/calendar.css'

const localizer = momentLocalizer(moment);

function Appointment() {
    const { serviceId, offerId } = useParams();
    const serviceIdnum = Number(serviceId);
    const offerIdnum = Number(offerId);
    const location = useLocation();
    const offer = location.state?.offer as IOfferType || { title: '', description: '' };

    const [view, setView] = useState<View>('week');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [timeSlots, setTimeSlots] = useState<ITimeSlot[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<ITimeSlot | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [description, setDescription] = useState(offer?.description || '');

    useEffect(() => {
        if (selectedDate && view === 'day') {
            fetchTimeSlots(selectedDate);
        }
    }, [selectedDate, view]);

    const fetchTimeSlots = async (date: Date) => {
        try {
            const response = await appointmentAPI.getAllAppointments(serviceIdnum);
            const slots = response.filter((slot: any) => {
                const slotStartDate = moment.utc(slot.startDate).local();
                return (
                    slotStartDate.year() === date.getFullYear() &&
                    slotStartDate.month() === date.getMonth() &&
                    slotStartDate.date() === date.getDate()
                );
            });

            setTimeSlots(slots.map((slot: any) => ({
                start: moment.utc(slot.startDate).local().toDate(),
                end: moment.utc(slot.endDate).local().toDate(),
                occupied: true
            })));
        } catch (error) {
            console.error('Failed to fetch time slots', error);
        }
    };

    const handleSelectSlot = (slotInfo: SlotInfo) => {
        const selectedDate = moment(slotInfo.start).startOf('week').toDate();
        setSelectedDate(selectedDate);
        setView('week');
        setSelectedSlot({
            start: slotInfo.start,
            end: slotInfo.end,
            occupied: false
        });
        setIsModalOpen(true);
    };

    const handleNavigate = (date: Date) => {
        if (view === 'week') {
            setSelectedDate(moment(date).startOf('week').toDate());
        }
    };

    const handleViewChange = (newView: View) => {
        setView(newView);
        if (newView === 'week' || newView === 'month') {
            setSelectedDate(null);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (selectedSlot) {
            try {
                const appointment = {
                    startDate: selectedSlot.start,
                    endDate: selectedSlot.end,
                    serviceId: serviceIdnum,
                    offerId: offerIdnum,
                    clientName: name,
                    clientEmail: email,
                    description // Include the offer description
                };
                await appointmentAPI.createAppointment(appointment);
                alert('Appointment booked successfully!');
                handleCloseModal();
            } catch (error) {
                console.error('Failed to book appointment', error);
            }
        }
    };

    const eventPropGetter = (event: ITimeSlot) => ({
        style: { backgroundColor: event.occupied ? '#ff6961' : '#77dd77' }
    });

    return (
        <div className="appointment-page min-h-screen bg-gray-50 flex flex-col items-center py-10">
            <h1 className="text-3xl font-semibold text-gray-700 mb-8">
            </h1>
            <Calendar
                localizer={localizer}
                events={timeSlots}
                startAccessor="start"
                endAccessor="end"
                views={['week']}
                view={view}
                onView={handleViewChange}
                onSelectSlot={handleSelectSlot}
                selectable
                onNavigate={handleNavigate}
                eventPropGetter={eventPropGetter}
                style={{ height: 650, width: '80%' }} // Increase height and width for better layout
                longPressThreshold={0}
                key={view + selectedDate?.toISOString()}
                defaultDate={selectedDate ? moment(selectedDate).tz('Europe/Amsterdam').startOf('day').toDate() : new Date()}
                className="rounded-lg shadow-md bg-white p-4" // Add box shadow and padding
            />

            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={handleCloseModal}>
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

                        <span className="inline-block h-screen align-middle" aria-hidden="true">
                            &#8203;
                        </span>
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
                                    Book appointment
                                </Dialog.Title>
                                {selectedSlot && (
                                    <p className="text-sm text-gray-500">
                                        {moment(selectedSlot.start).format('hh:mm A')} - {moment(selectedSlot.end).format('hh:mm A')}
                                    </p>
                                )}
                                <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
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
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
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
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">More information</label>
                                        <textarea
                                            id="description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            required
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
                                            onClick={handleCloseModal}
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
        </div>
    );
}

export default Appointment;
