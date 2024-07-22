import { useEffect, useState } from "react";
import serviceAPI from "../API/serviceAPI";
import ServiceList from "../components/ServiceList";

function Home() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshServices = () => {
    setIsLoading(true);
    serviceAPI.getServices().then((data) => {
      setServices(data);
      setIsLoading(false);
    }).catch(error => {
      console.error("Failed to fetch services:", error);
      setServices([]);
      setIsLoading(false);
    });
  };


  useEffect(() => {
    refreshServices();
  }, []);

  return (
    <div className="home min-h-screen bg-gray-100 p-4">
        {isLoading ? (
        <p>Loading services...</p>
      ) : (
      <ServiceList services={services} />
    )}

    </div>
  );
}

export default Home;
