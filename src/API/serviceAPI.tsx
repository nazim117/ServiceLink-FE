import axios from "axios";
import TokenManager from "./TokenManager";
import baseUrl from "./baseUrl";

interface IData{
    name: string;
    address: string;
    imagePath: string;
    description: string;
}

const serviceUrl = baseUrl.services;

const serviceAPI = {
  getServices : () => axios
      .get(serviceUrl,
        {
          headers: { 
            Authorization: `Bearer ${TokenManager.getAccessTokenFromLocalStorage()}`,
          }
        })
      .then(res => res.data.services)
      .catch(error => {
        console.error("Error getting service: ", error);
        throw error;
      }),
      
  getService : async (id: number) =>{
    try{
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${serviceUrl}/${id}`,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TokenManager.getAccessTokenFromLocalStorage()}`,
        },
      };
      
      const response = await axios.request(config);
      return response.data;
    }catch(error) {
      console.error("Error getting service: ", error);
      throw error;
    }
  },

  post: async (data: IData) => {
    try{
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: serviceUrl,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TokenManager.getAccessTokenFromLocalStorage()}`,
        },
        data
      };
      const response = await axios.request(config);
      return response.data;
    }catch(error ){
      console.error("Error posting service: ", error);
      return error;
    };
  },

  edit: async (id: number, data: IData) => {
    let config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: `${serviceUrl}/${id}`,
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TokenManager.getAccessTokenFromLocalStorage()}`,
      },
      data
    };
    axios.request(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error editing service: ", error);
    });
  },

  delete: async (id: number) => {
    let config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: `${serviceUrl}/${id}`,
      headers: {
        Authorization: `Bearer ${TokenManager.getAccessTokenFromLocalStorage()}`,
       },
    };
    
    axios.request(config)
    .then(() => {
      console.log("Service was deleted");
      return;
    })
    .catch((error) => {
      console.error("Error deleting user: ", error);
    });
  },
}

export default serviceAPI;