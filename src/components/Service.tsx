import React from "react";
import { IServiceType } from "../interfaces/IServiceType";

interface ServiceProps {
  service: IServiceType;
}

function Service({ service }: ServiceProps) {
  return (
    <div className="service-item bg-white rounded-lg shadow-md p-4">
      <h2 className="text-2xl font-semibold mb-2">{service.name}</h2>
      <p className="text-gray-600 mb-4">{service.description}</p>
      {service.imagePath && (
        <img
          className="w-full h-48 object-cover mb-4 rounded-md"
          src={service.imagePath}
          alt={service.name}
        />
      )}
      <div className="mb-4">
        <h3 className="text-lg font-medium">Address</h3>
        <p className="text-gray-600">
          {service.address.street}, {service.address.city}, {service.address.country}, {service.address.postalCode}
        </p>
      </div>
      <div className="text-gray-600">
        {!service.offers ? "No offers available" : service.offers}
      </div>
      {/* Render offers or other details if available */}
    </div>
  );
}

export default Service;
