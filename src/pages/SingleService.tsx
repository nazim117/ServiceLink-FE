import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import serviceAPI from "../API/serviceAPI";
import Service from "../components/Service";
import { IServiceType } from "../interfaces/IServiceType";

function SingleService(){
    const [service, setService] = useState<IServiceType | null>(null);
    const {serviceId} = useParams();

    const refreshService = () => {
        if (serviceId) {
            const id = parseInt(serviceId, 10);
            serviceAPI.getService(id)
                .then((data) => {
                    setService(data);
                })
                .catch((error) => {
                    console.error("Error occurred: ", error);
                });
        }
    }

    useEffect(() => {
        refreshService();
    }, [serviceId]);

    return(
        <div>
            <h1>Service page</h1>
            {service && <Service key={service.id} service={service} />}
        </div>
    )
}

export default SingleService;