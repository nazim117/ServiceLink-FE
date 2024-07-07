import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import TokenManager from "../API/TokenManager";
import loginAPI from "../API/loginAPI";
import { useAuth } from "../components/AuthContext";
import { IUserClaims } from "../API/TokenManager";
import { ICredentials } from "../interfaces/ICredentials";

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setError('');
    }

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setError('');
    }

    const handleLogin = async (credentials: ICredentials) => {
        try {
            const newClaims: IUserClaims | null = await loginAPI.login(credentials);
            if (newClaims) {
                TokenManager.setClaimsToLocalStorage(newClaims);
                console.log("Claims: ", newClaims);
                login();
                navigate("/");
            } else {
                setError("Invalid credentials. Check your email and password");
            }
        } catch (error) {
            console.error(error);
            setError("Invalid credentials. Check your email and password");
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const loginCredentials: ICredentials = {
                email,
                password
            };
            await handleLogin(loginCredentials);
        } catch (error) {
            console.error("Error logging in: ", error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border-2 border-gray-400">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            value={email} 
                            onChange={handleEmailChange} 
                            required 
                            autoComplete="username"
                            className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            id="password" 
                            value={password} 
                            onChange={handlePasswordChange} 
                            required 
                            autoComplete="current-password"
                            className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button 
                        type="button" 
                        onClick={togglePasswordVisibility}
                        className="mb-4 text-blue-500 hover:text-blue-700 focus:outline-none"
                    >
                        <i className={showPassword ? "fa fa-eye-slash" : "fa fa-eye"}></i>
                        {showPassword ? " Hide password" : " Show password"}
                    </button>
                    <button 
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Login
                    </button>
                    {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
                </form>
                <div className="mt-4 text-center">
                    <a className="text-blue-500 hover:text-blue-700" href="/register">Create account</a>
                </div>
            </div>
        </div>
    );
    
    
}

export default LoginPage;
