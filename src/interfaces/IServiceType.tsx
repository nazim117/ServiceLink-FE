import { AddressType } from './IAddressType';
import { IOfferType } from './IOfferType';

export interface IServiceType {
    id: number;
    name: string;
    description: string;
    imagePath: string; // Assuming null or string based on your data
    offers: IOfferType[]; // Update with specific type if known
    address: AddressType;
}
