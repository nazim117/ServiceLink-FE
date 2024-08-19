import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import serviceAPI from "../API/serviceAPI";
import Service from "../components/Service";
import { IServiceType } from "../interfaces/IServiceType";
import OfferList from "../components/OfferList";
import offerAPI from "../API/offerAPI";
import { IOfferType } from "../interfaces/IOfferType";

function SingleService(){
    const [service, setService] = useState<IServiceType | null>(null);
    const [offers, setOffers] = useState<IOfferType[] | null>(null);
    const {serviceId} = useParams();

    const refreshService = () => {
        if (serviceId) {
            const id = parseInt(serviceId, 10);
            console.log(id);
            serviceAPI.getService(id)
                .then((data) => {
                    setService(data);
                    
                    offerAPI.get(id)
                    .then((data) => setOffers(data))
                    .catch((error) => console.error("Error fetching offers: ", error))
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
                    {offers ? <OfferList offers={offers} serviceId={service.id}/> : "No offers"}
                </div>
            }
        </div>
    )
}

export default SingleService;