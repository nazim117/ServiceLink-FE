import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IServiceType } from "../interfaces/IServiceType";

interface ServiceProps {
  service: IServiceType;
}

function Service({ service }: ServiceProps) {
  const [imageSrc, setImageSrc] = useState<string |  undefined>(undefined);

  useEffect(() => {
    let url: string | undefined;

    if (service.imageFile instanceof File) {
      url = URL.createObjectURL(service.imageFile);
      setImageSrc(url);

      return () => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      };
    } else {
      setImageSrc(service.imageFile);
    }
  }, [service.imageFile]);

  const servicePagePath = `/service/${service.id}`;

  return (
    <Link to={servicePagePath} className="group block transform transition duration-300 hover:scale-105">
      <div className="service-item bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-2xl transition-shadow duration-300">
        {imageSrc && (
          <img
            className="w-full h-48 object-cover rounded-lg mb-4"
            src={imageSrc}
            alt={service.name}
          />
        )}
        <h2 className="text-2xl font-semibold mb-2 text-gray-800 group-hover:text-teal-600 transition-colors duration-300">{service.name}</h2>
        <p className="text-gray-600 mb-4">{service.description}</p>
        <div className="text-gray-500">
          <p className="text-sm">{service.address.street}</p>
          <p className="text-sm">{service.address.city}</p>
        </div>
      </div>
    </Link>
  );
}

export default Service;
