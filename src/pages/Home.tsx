import { useEffect, useState } from "react";
import serviceAPI from "../API/serviceAPI";
import ServiceList from "../components/ServiceList";

function Home() {
  const [services, setServices] = useState([]);

  const refreshServices = () => {
    serviceAPI.getServices().then((data) => {
      console.log(data);
      setServices(data);
    });
  };

  useEffect(() => {
    refreshServices();
  }, []);

  return (
    <div className="home min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Home Page</h1>
      <ServiceList services={services} />
    </div>
  );
}

export default Home;
