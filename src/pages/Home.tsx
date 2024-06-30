import { useEffect, useState } from "react";
import serviceAPI from "../API/serviceAPI";
import ServiceList from "../components/ServiceList";
function Home(){
    const[services, setServices] = useState([]);

    const refreshServices = () => {
        serviceAPI.getServices()
        .then((data) => {
            console.log(data);
            setServices(data);
        })
    }

    useEffect(() => {
        refreshServices();
    }, []);
    return(
        <div className="home">
            <h1>Home page</h1>
            <ServiceList services={services}/>
        </div>
    )
}

export default Home;