import { off } from "process";
import { IOfferType } from "../interfaces/IOfferType";
import { Offer } from "./Offer";

interface OfferListProps{
    offers: IOfferType[];
    serviceId:number;
}

function OfferList({offers, serviceId}: OfferListProps){

    return(
        <>
            {
                offers.map((offer: IOfferType, index: number) => (
                    <Offer key={index} offer={offer} serviceId={serviceId} index={index}/>
                ))
            }
        </>
    )
}

export default OfferList;