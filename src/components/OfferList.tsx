import { IOfferType } from "../interfaces/IOfferType";
import { Offer } from "./Offer";
import "../styles/offer.css"

interface OfferListProps {
  offers: IOfferType[];
  serviceId: number;
}

function OfferList({ offers, serviceId }: OfferListProps) {
  return (
    <div className="offer-list">
      {offers && offers.map((offer: IOfferType, index: number) => (
          <Offer offer={offer} serviceId={serviceId} index={index} />
      ))}
    </div>
  );
}

export default OfferList;
