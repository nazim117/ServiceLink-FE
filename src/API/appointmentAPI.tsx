import axios from 'axios';
import baseUrl from './baseUrl';
import { IAppointmentType } from '../interfaces/IAppointmentType';

const appointmentUrl = baseUrl.appointments;

const appointmentAPI = {
  async getAllAppointments(serviceId: number) {
    try {
      const response = await axios.get(`${appointmentUrl}/serviceId/${serviceId}`);
      console.log("appointments: ", response.data.appointments);
      return response.data.appointments;
    } catch (error) {
      throw error;
    }
  },

  async getAppointment(id: number) {
    try {
      const response = await axios.get(`${appointmentUrl}/${id}`);
      console.log("response: ", response);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch appointment', error);
      throw error;
    }
  },

  async createAppointment(appointment: IAppointmentType) {
    try {
      const response = await axios.post(`${appointmentUrl}`, appointment);
      return response.data;
    } catch (error) {
      console.error('Failed to create appointment', error);
      throw error;
    }
  },

  async updateAppointment(id: number, appointment: IAppointmentType) {
    try {
      await axios.put(`${appointmentUrl}/${id}`, appointment);
    } catch (error) {
      console.error('Failed to update appointment', error);
      throw error;
    }
  },

  async deleteAppointment(id: number) {
    try {
      await axios.delete(`${appointmentUrl}/${id}`);
    } catch (error) {
      console.error('Failed to delete appointment', error);
      throw error;
    }
  }
};

export default appointmentAPI;
