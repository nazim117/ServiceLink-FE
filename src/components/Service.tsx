import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IServiceType } from '../interfaces/IServiceType';

interface ServiceProps {
  service: IServiceType;
  disableLink?: boolean; // Add a new prop to control the link
}

function Service({ service, disableLink = false }: ServiceProps) {
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);

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

  const content = (
    <div className="service-item bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      {imageSrc && (
        <img
          className="w-full h-48 object-cover rounded-lg mb-4"
          src={imageSrc}
          alt={service.name}
        />
      )}
      <h2 className="text-2xl font-semibold mb-2 text-gray-800">{service.name}</h2>
      <p className="text-gray-600 mb-4">{service.description}</p>
      <div className="text-gray-500">
        <p className="text-sm">{service.address.street}</p>
        <p className="text-sm">{service.address.city}</p>
      </div>
    </div>
  );

  return disableLink ? (
    content // Return the static content without the link if disableLink is true
  ) : (
    <Link to={servicePagePath} className="group block transform transition duration-300 hover:scale-105">
      {content}
    </Link>
  );
}

export default Service;
