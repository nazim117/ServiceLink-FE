import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import userAPI from "../API/userAPI";
import TokenManager, { IUserClaims } from "../API/TokenManager";
import { useNavigate } from "react-router-dom";

interface IUserDetails {
    name: string;
    email: string;
    password: string;
}

function UserProfile() {
    const claims: IUserClaims | null = TokenManager.getClaimsFromLocalStorage();
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();

    const getUserDetails = () => {
        if (claims?.roles?.some((role: string) => ['ADMIN', "SERVICE_PROVIDER", "CLIENT"].includes(role)) && claims?.userId) {
            userAPI.getUser(claims.userId)
                .then((data: IUserDetails) => {
                    setUserDetails(data);
                })
                .catch((e) => {
                    console.error("Error retrieving user data: ", e);
                    navigate('/unauthorized');
                });
        }
    };

    const setUserDetails = (data: IUserDetails) => {
        const { name, email, password } = data;
        setName(name);
        setEmail(email);
        setPassword(password);
    };

    useEffect(() => {
        getUserDetails();
    }, []);

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const userCredentials: IUserDetails = {
            name,
            email,
            password,
        };

        if (claims) {
            userAPI.edit(claims.userId, userCredentials)
                .then(() => {
                    alert("Edit was successful");
                });
        }
    };

    return (
        <div className="login-container">
            <h1>User Profile</h1>
            <form onSubmit={handleSubmit}>
                <div className="box name">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" value={name || ''} onChange={handleNameChange} required autoComplete="given-name" />
                </div>
                <div className="box email">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" value={email || ''} onChange={handleEmailChange} required autoComplete="email" />
                </div>
                <div className="box password">
                    <input type="hidden" id="password" value={password || ''} onChange={handlePasswordChange} required autoComplete="current-password" />
                </div>
                <button type="submit">Update</button>
            </form>
        </div>
    );
}

export default UserProfile;
