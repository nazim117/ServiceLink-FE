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
        <div key={index} className="offer-item">
          <Offer offer={offer} serviceId={serviceId} index={index} />
        </div>
      ))}
    </div>
  );
}

export default OfferList;
