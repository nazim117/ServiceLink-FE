import axios from "axios";
import baseUrl from "./baseUrl";
import { IOfferType } from "../interfaces/IOfferType";
import TokenManager from "./TokenManager";

const offerUrl = baseUrl.offers;

const offerAPI = {
    get : (id:number) => axios
      .get(`${offerUrl}/${id}`,
        {
          headers: { 
            Authorization: `Bearer ${TokenManager.getAccessTokenFromLocalStorage()}`,
          }
        })
      .then(res => res.data.offers)
      .catch(error => {
        console.error("Error getting offers: ", error);
        throw error;
      }),
    
    create: async (data: IOfferType) => {
        try{
          let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: offerUrl,
            headers: { 
              'Content-Type': 'application/json',
              Authorization: `Bearer ${TokenManager.getAccessTokenFromLocalStorage()}`,
            },
            data
          };
          const response = await axios.request(config);
          console.log("response: ", response);
          return response.data;
        }catch(error ){
          console.error("Error posting offer: ", error);
          return error;
        };
      },
}

export default offerAPI;