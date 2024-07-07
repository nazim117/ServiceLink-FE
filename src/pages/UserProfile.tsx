import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import userAPI from "../API/userAPI";
import TokenManager, { IUserClaims } from "../API/TokenManager";
import { useNavigate } from "react-router-dom";
import { IUserCredentials } from "../interfaces/IUserCredentials";

function UserProfile() {
    const claims: IUserClaims | null = TokenManager.getClaimsFromLocalStorage();
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();

    const getUserDetails = () => {
        if (claims?.roles?.some((role: string) => ['ADMIN', "SERVICE_PROVIDER", "CLIENT"].includes(role)) && claims?.userId) {
            userAPI.getUser(claims.userId)
                .then((data: IUserCredentials) => {
                    setUserDetails(data);
                })
                .catch((e) => {
                    console.error("Error retrieving data: ", e);
                    navigate('/unauthorized');
                });
        }
    };

    const setUserDetails = (data: IUserCredentials) => {
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
        const userCredentials: IUserCredentials = {
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name || ''}
                            onChange={handleNameChange}
                            required
                            autoComplete="given-name"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email || ''}
                            onChange={handleEmailChange}
                            required
                            autoComplete="email"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="hidden"
                            id="password"
                            value={password || ''}
                            onChange={handlePasswordChange}
                            required
                            autoComplete="current-password"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Update
                    </button>
                </form>
            </div>
        </div>
    );
}

export default UserProfile;
