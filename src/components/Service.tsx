import React from "react";

interface AddressType {
  city: string;
  country: string;
  postalCode: string;
  street: string;
  id: number | null; // Assuming null or number based on your data
}

interface ServiceType {
  id: number;
  name: string;
  description: string;
  imagePath: string | null; // Assuming null or string based on your data
  offers: any; // Update with specific type if known
  address: AddressType;
}

interface ServiceProps {
  service: ServiceType;
}

function Service({ service }: ServiceProps) {
  return (
    <div className="service-item">
      <h2>{service.name}</h2>
      <p>{service.description}</p>
      {service.imagePath && <img src={service.imagePath} alt={service.name} />}
      <div>
        <h3>Address</h3>
        <p>{service.address.street}, {service.address.city}, {service.address.country}, {service.address.postalCode}</p>
      </div>
      <div>
          {!service.offers ? "No offers available" : service.offers}
      </div>
      {/* Render offers or other details if available */}
    </div>
  );
}

export default Service;
