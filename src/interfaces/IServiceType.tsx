import { AddressType } from './IAddressType';
import { IOfferType } from './IOfferType';

export interface IServiceType {
    id: number;
    name: string;
    description: string;
    imageFile?: File;
    offers: IOfferType[];
    address: AddressType;
    userId: any;
}
