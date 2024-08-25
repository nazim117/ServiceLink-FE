import Service from "../components/Service";
import { IServiceType } from "../interfaces/IServiceType";
import "../styles/service.css";

interface ServiceListProps {
  services: IServiceType[];
}

function ServiceList({ services = [] }: ServiceListProps) {
  return (
    <div className="service-list">
      {services.map((service) => (
        <Service key={service.id} service={service} />
      ))}
    </div>
  );
}

export default ServiceList;