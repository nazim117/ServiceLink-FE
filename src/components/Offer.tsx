import React, { useEffect, useState } from 'react';
import { IOfferType } from "../interfaces/IOfferType";
import { Link } from 'react-router-dom';

interface OfferProps {
  offer: IOfferType;
  index: number;
  serviceId: number;
}

export function Offer({ offer, serviceId, index }: OfferProps) {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    let url: string | undefined;

    if (offer.imageFile instanceof File) {
      url = URL.createObjectURL(offer.imageFile);
      setImageUrl(url);

      return () => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      };
    } else {
      setImageUrl(offer.imageFile);
    }
  }, [offer.imageFile]);

  const appointmentPath = `/service/${serviceId}/offers/${offer.id}/appointment`;

  return (
    <Link to={appointmentPath} state={{ offer }}>
      <div
        key={index}
        className="bg-white p-5 rounded-lg shadow-lg mb-6 border border-gray-200 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
      >
        <div className="flex flex-col md:flex-row items-center">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={`${offer.name} image`}
              className="w-full md:w-48 h-32 object-cover rounded-md mb-4 md:mb-0 md:mr-4"
            />
          )}
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{offer.name}</h3>
            <p className="text-gray-600 mb-2">{offer.description}</p>
            <p className="text-gray-700 mb-1">Duration: {offer.duration} minutes</p>
            <p className="text-gray-700 font-medium">Price: ${offer.price}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
