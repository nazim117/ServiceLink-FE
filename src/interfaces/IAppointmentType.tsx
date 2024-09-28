export interface IAppointmentType{
    id?: number;
    start: string;
    end: string;
    serviceId: number;
    offerId: number;
    clientName: string;
    clientEmail: string;
    description: string;
}