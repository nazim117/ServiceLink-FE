import { jwtDecode } from "jwt-decode";
import {IUserClaims} from "../interfaces/IUserClaims";
import {IUserData} from "../interfaces/IUserData";

const userData: IUserData = {
    accessToken: null,
    claims: null
}

const TokenManager = {
    getAccessToken: (): string | null => {
        return userData.accessToken;
    },
    getClaims: (): IUserClaims | null => {
        return userData.claims;
    },
    setAccessToken: (token: string): IUserClaims | null => {
        userData.accessToken = token;
        const claims: IUserClaims = jwtDecode(token);
        userData.claims = claims;
        return userData.claims;
    },
    getClaimsFromLocalStorage: (): IUserClaims | null => {
        const storedClaims = localStorage.getItem('claims');
        return storedClaims ? JSON.parse(storedClaims) : null;
    },
    setClaimsToLocalStorage: (claims: IUserClaims): void => {
        console.log("token manager claims:", claims);
        localStorage.setItem('claims', JSON.stringify(claims));
    },
    getAccessTokenFromLocalStorage: (): string | null => {
        return localStorage.getItem('accessToken');
    },
    setAccessTokenToLocalStorage: (token: string): void => {
        localStorage.setItem('accessToken', token);
    },
    clear: (): void => {
        localStorage.removeItem('claims');
        localStorage.removeItem('accessToken');
        userData.accessToken = null;
        userData.claims = null;
    }
}

export default TokenManager;
export type { IUserClaims };