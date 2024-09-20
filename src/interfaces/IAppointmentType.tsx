export interface IAppointmentType{
    id?: number;
    start: Date;
    end: Date;
    serviceId: number;
    offerId: number;
    clientName: string;
    clientEmail: string;
    description: string;
}