export interface IOfferType{
    id: number;
    name: string;
    duration: number;
    description: string;
    imageFile?: File;
    price: number;
    serviceId: number;
}