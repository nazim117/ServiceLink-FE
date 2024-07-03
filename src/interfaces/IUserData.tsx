import { IUserClaims } from "./IUserClaims";

export interface IUserData {
    accessToken: string | null;
    claims: IUserClaims | null;
}