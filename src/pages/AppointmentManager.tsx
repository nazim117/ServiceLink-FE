import React, { useState, useEffect } from 'react';
import { IAppointmentType } from '../interfaces/IAppointmentType';
import TokenManager from '../API/TokenManager';
import serviceAPI from '../API/serviceAPI';
import appointmentAPI from '../API/appointmentAPI';

const AppointmentsPage: React.FC = () => {
    const userId = TokenManager.getClaimsFromLocalStorage()?.userId;
    const [appointments, setAppointments] = useState<IAppointmentType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        serviceAPI.getServiceByUserId(userId)
            .then(response => {
                return appointmentAPI.getAllAppointments(response.id);
            })
            .then(response => {
                setAppointments(response);
                setLoading(false);
            })
            .catch(error => {
                setError("Error getting appointments");
                console.error("Error getting appointments:", error);
            });
    }, [userId]);
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="appointments-page container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Appointments</h1>
            <div className="overflow-x-auto">
                <table className="appointments-table min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
                    <thead className="bg-gray-100 border-b border-gray-200">
                        <tr>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Start</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">End</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((appointment) => (
                            <tr key={appointment.id} className="border-b border-gray-200 hover:bg-gray-50 transition duration-150">
                                <td className="py-3 px-4 text-gray-700">{appointment.description}</td>
                                <td className="py-3 px-4 text-gray-700">{new Date(appointment.start).toLocaleString()}</td>
                                <td className="py-3 px-4 text-gray-700">{new Date(appointment.end).toLocaleString()}</td>
                                <td className="py-3 px-4 text-gray-700">{appointment.clientName}</td>
                                <td className="py-3 px-4 text-gray-700">{appointment.clientEmail}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
    
}

export default AppointmentsPage;
