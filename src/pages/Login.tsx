import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import TokenManager from "../API/TokenManager";
import loginAPI from "../API/loginAPI";
import { useAuth } from "../components/AuthContext";

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    interface ICredentials {
        email: string;
        password: string;
    }

    interface IUserClaims {
        [key: string]: any; // Consider specifying the expected properties more explicitly.
    }

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
        <div className="login-container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div className="box email">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" value={email} onChange={handleEmailChange} required autoComplete="username" />
                </div>
                <div className="box password">
                    <label htmlFor="password">Password</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                        required autoComplete="current-password"
                    />
                </div>
                <button className="toggle-password" type="button" onClick={togglePasswordVisibility}>
                    <i className={showPassword ? "fa fa-eye-slash" : "fa fa-eye"}></i>
                    {showPassword ? "Hide password" : "Show password"}
                </button>
                <button type="submit">Login</button>
                {error && <div className="error-message">{error}</div>}
            </form>
            <div>
                <a className="create-account" href="/register">Create account</a>
            </div>
        </div>
    );
}

export default LoginPage;
