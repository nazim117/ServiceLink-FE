import axios from "axios";
import baseUrl from "./baseUrl";

const offerUrl = baseUrl.offers;

const offerAPI = {
    get : (id:number) => axios
      .get(`${offerUrl}/${id}`)
      .then(res => res.data.offers)
      .catch(error => {
        console.error("Error getting offers: ", error);
        throw error;
      }),
    getOfferById: (offerId:number) => axios
      .get(`${offerUrl}/offer/${offerId}`)
      .then(res => res.data)
      .catch(error => {
        console.error("Error getting offer: ", error);
        throw error;
    }),

    create: async (data: FormData) => {
        try{
          let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: offerUrl,
            data,
          };
          const response = await axios.request(config);
          return response.data;
        }catch(error ){
          console.error("Error posting offer: ", error);
          return error;
        };
      },
}

export default offerAPI;