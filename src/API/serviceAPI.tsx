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

  getServiceByUserId : async (id: number) => {
    try {
      const response = await axios.get(`${serviceUrl}/user/${id}`);
      
      // Return the response data if status is 200 OK
      if (response.status === 200) {
        return response.data;
      }
      
      // Handle specific cases based on status
      if (response.status === 404) {
        throw new Error('Service not found');
      }
      
      if (response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      
      // Handle unexpected status codes
      throw new Error('Unexpected response status');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Handle error responses from the server
          if (error.response.status === 404) {
            throw new Error('Service not found');
          }
          if (error.response.status >= 500) {
            throw new Error('Server error. Please try again later.');
          }
        } else if (error.request) {
          // No response received
          throw new Error('No response received from the server.');
        } else {
          // Error in setting up the request
          throw new Error('An unexpected error occurred.');
        }
      } else if (error instanceof Error) {
        // Handle general error cases
        throw new Error(error.message);
      } else {
        // Handle cases where error is not an instance of Error
        throw new Error('An unexpected error occurred.');
      }
    }
  },
  
  post: async (data: FormData) => {
    try{
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: serviceUrl,
        data
      };
      const response = await axios.request(config);
      return response.data;
    } catch(error ){
      throw error;
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