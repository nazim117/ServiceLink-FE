import React from "react";
import Service from "../components/Service";

interface AddressType {
  city: string;
  country: string;
  postalCode: string;
  street: string;
  id: number | null;
}

interface ServiceType {
  id: number;
  name: string;
  description: string;
  imagePath: string | null;
  offers: any; // Update with specific type if known
  address: AddressType;
}

interface ServiceListProps {
  services: ServiceType[];
}

function ServiceList({ services }: ServiceListProps) {
  return (
    <div className="service-list grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <Service key={service.id} service={service} />
      ))}
    </div>
  );
}

export default ServiceList;
