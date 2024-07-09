import { off } from "process";
import { IOfferType } from "../interfaces/IOfferType";
import { Offer } from "./Offer";

interface OfferListProps{
    offers: IOfferType[];
}

function OfferList({offers}: OfferListProps){

    return(
        <>
            {
                offers.map((offer: IOfferType, index: number) => (
                    <Offer key={index} offer={offer} index={index}/>
                ))
            }
        </>
    )
}

export default OfferList;