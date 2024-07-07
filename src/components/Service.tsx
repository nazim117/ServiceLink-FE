import {Link} from 'react-router-dom';
import { IServiceType } from "../interfaces/IServiceType";

interface ServiceProps {
  service: IServiceType;
}

function Service({ service }: ServiceProps) {

  const servicePagePath = `/service/${service.id}`

  return (
    <Link to={servicePagePath} className="group block transform transition duration-300 hover:scale-105">
      <div className="service-item bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-2xl">
        <h2 className="text-3xl font-semibold mb-2 text-[#10232f] group-hover:text-[#139c9c] transition-colors duration-300">{service.name}</h2>
        <p className="text-gray-700 mb-4">{service.description}</p>
        {service.imagePath && (
          <img
            className="w-full h-48 object-cover mb-4 rounded-md"
            src={service.imagePath}
            alt={service.name}
          />
        )}
        <div className="mb-4">
          <p className="text-gray-600">
            {service.address.street}, {service.address.city}
          </p>
        </div>
      </div>
    </Link>

  );
}

export default Service;
