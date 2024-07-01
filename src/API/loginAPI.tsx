import axios from "axios";
import TokenManager from "./TokenManager";
import baseUrl from "./baseUrl";

interface ICredentials{
    email: string;
    password: string;
}

interface IUser{
    username: string;
    email: string;
    password: string;
}

const tokenUrl = baseUrl.tokens;

const loginAPI = {
    login: async (credentials: ICredentials) => {
      try{
        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: tokenUrl,
          headers: { 
            'Content-Type': 'application/json'
          },
          data : credentials
        };
        
        const response = await axios.request(config);
        const accessToken = response.data.accessToken;
        TokenManager.setAccessTokenToLocalStorage(accessToken);
        return TokenManager.setAccessToken(accessToken)
      }catch(error) {
        console.error(error);
        throw error;
      }
    },
    register: async(user: IUser) => {
      try{
        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: `${tokenUrl}/register`,
          headers: { 
            'Content-Type': 'application/json'
          },
          data : user
        };
        
        const response = await axios.request(config);
        const accessToken = response.data.accessToken;
        TokenManager.setAccessTokenToLocalStorage(accessToken);
        return TokenManager.setAccessToken(accessToken)
      }catch(error) {
        console.error(error);
        throw error;
      }
    }
}

export default loginAPI;