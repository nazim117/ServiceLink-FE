import axios from "axios";
import TokenManager from "./TokenManager";
import baseUrl from "./baseUrl";

interface IData{
    name: string;
    email: string;
    password: string;
}

const userUrl = baseUrl.users;

const userAPI = {
  getUsers : () => axios
      .get(userUrl,
        {
          headers: { 
            Authorization: `Bearer ${TokenManager.getAccessTokenFromLocalStorage()}`,
          }
        })
      .then(res => res.data.users)
      .catch(error => {
        console.error("Error getting users: ", error);
        throw error;
      }),
      
  getUser : async (id: number) =>{
    try{
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${userUrl}/${id}`,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TokenManager.getAccessTokenFromLocalStorage()}`,
        },
      };
      
      const response = await axios.request(config);
      return response.data;
    }catch(error) {
      console.error("Error getting user: ", error);
      throw error;
    }
  },

  post: async (data: IData) => {
    try{
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: userUrl,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TokenManager.getAccessTokenFromLocalStorage()}`,
        },
        data
      };
      const response = await axios.request(config);
      return response.data;
    }catch(error ){
      console.error("Error posting user: ", error);
      return error;
    };
  },

  edit: async (id: number, data: IData) => {
    let config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: `${userUrl}/${id}`,
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
      console.error("Error editing user: ", error);
    });
  },

  delete: async (id: number) => {
    let config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: `${userUrl}/${id}`,
      headers: {
        Authorization: `Bearer ${TokenManager.getAccessTokenFromLocalStorage()}`,
       },
    };
    
    axios.request(config)
    .then(() => {
      console.log("User was deleted");
      return;
    })
    .catch((error) => {
      console.error("Error deleting user: ", error);
    });
  },
}

export default userAPI;