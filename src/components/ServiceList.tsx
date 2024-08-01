import Service from "../components/Service";
import { IServiceType } from "../interfaces/IServiceType";

interface ServiceListProps {
  services: IServiceType[];
}

function ServiceList({ services = [] }: ServiceListProps) {
  return (
    <div className="service-list grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <Service key={service.id} service={service} />
      ))}
    </div>
  );
}


export default ServiceList;
