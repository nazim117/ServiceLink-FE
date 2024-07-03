import { AddressType } from './IAddressType';

export interface IServiceType {
    id: number;
    name: string;
    description: string;
    imagePath: string | null; // Assuming null or string based on your data
    offers: any; // Update with specific type if known
    address: AddressType;
}
