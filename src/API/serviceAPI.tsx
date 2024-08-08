import axios from "axios";
import baseUrl from "./baseUrl";
import {IServiceType} from "../interfaces/IServiceType";

const serviceUrl = baseUrl.services;

const serviceAPI = {
  getServices : () => axios
      .get(serviceUrl)
      .then(res => res.data.serviceProviders)
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
          'Content-Type': 'application/json'
        },
      };
      
      const response = await axios.request(config);
      return response.data;
    }catch(error) {
      console.error("Error getting service: ", error);
      throw error;
    }
  },

  getServiceByUserId : async (id: number) =>{
    try{
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${serviceUrl}/user/${id}`,
        headers: { 
          'Content-Type': 'application/json'
        },
      };
      
      const response = await axios.request(config);
      return response.data;
    }catch(error) {
      throw error;
    }
  },

  post: async (data: IServiceType) => {
    try{
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: serviceUrl,
        headers: { 
          'Content-Type': 'application/json',
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

  edit: async (id: number, data: IServiceType) => {
    let config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: `${serviceUrl}/${id}`,
      headers: { 
        'Content-Type': 'application/json',
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