import axios from "axios";
import baseUrl from "./baseUrl";
import { IOfferType } from "../interfaces/IOfferType";

const offerUrl = baseUrl.offers;

const offerAPI = {
    get : () => {
        return axios.get(offerUrl);
    },
    
    create : (offer: IOfferType) => {
        return axios.post(offerUrl, offer);
    }
}

export default offerAPI;