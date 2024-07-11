import { IOfferType } from "../interfaces/IOfferType"
import { Link } from 'react-router-dom';

interface OfferProps {
  offer: IOfferType;
  index: number;
  serviceId: number;
}

export function Offer({ offer, serviceId, index }: OfferProps) {
  const appointmentPath = `/service/${serviceId}/offers/${offer.id}/appointment`;

  return (
    <Link to={appointmentPath} state={{ offer }}>
      <div key={index} className="bg-white p-4 rounded-lg shadow-md mb-4 border border-gray-300">
        <h3 className="text-lg font-medium">{offer.name}</h3>
        <p className="text-sm text-gray-600">{offer.description}</p>
        <p className="text-sm">Duration: {offer.duration} minutes</p>
        <p className="text-sm">Price: ${offer.price}</p>
        <img src={offer.imagePath} alt={offer.name} className="w-full h-32 object-cover mt-2 rounded-md" />
      </div>
    </Link>
  );
}