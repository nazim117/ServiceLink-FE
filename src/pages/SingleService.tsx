import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import serviceAPI from "../API/serviceAPI";
import Service from "../components/Service";
import { IServiceType } from "../interfaces/IServiceType";
import OfferList from "../components/OfferList";

function SingleService(){
    const [service, setService] = useState<IServiceType | null>(null);
    const {serviceId} = useParams();

    const refreshService = () => {
        if (serviceId) {
            const id = parseInt(serviceId, 10);
            console.log(id);
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
            {
                service && 
                <div>
                    <Service key={service.id} service={service} />
                    {service.offers ? <OfferList offers={service.offers}/> : "No offers"}
                </div>
            }
        </div>
    )
}

export default SingleService;