export interface IAppointmentType{
    id?: number;
    startDate: Date;
    endDate: Date;
    serviceId: number;
    offerId: number;
    clientName: string;
    clientEmail: string;
    description: string;
}