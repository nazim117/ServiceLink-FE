import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import loginAPI from "../API/loginAPI";
import TokenManager from "../API/TokenManager";
import { useAuth } from "../components/AuthContext";
import { IUserDetails } from "../interfaces/IUserDetails";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("CLIENT");
    const navigate = useNavigate();
    const { login } = useAuth();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const handleFNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
    }

    const handleRoleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setRole(e.target.value);
    }

    const handleCreateUser = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!name || !email) {
            alert("Fill in all required fields");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        let newUser: IUserDetails = {
            name,
            email,
            password,
            role,
        };

        loginAPI.register(newUser)
            .then((newClaims) => {
                if (newClaims) {
                    TokenManager.setClaimsToLocalStorage(newClaims);
                    console.log("New claims: ", newClaims)
                    login();
                    navigate("/");
                }
            })
            .catch((error) => {
                console.error("Error fetching items ", error)
            })
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full border-2 border-gray-400">
                <form onSubmit={handleCreateUser}>
                    <div className="mb-4">
                        <label htmlFor="fName" className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" id="fName" name="fName" value={name} onChange={handleFNameChange} required autoComplete="given-name" className="mt-1 block w-full px-3 py-2 bg-white border-2 border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="email" name="email" value={email} onChange={handleEmailChange} required autoComplete="email" className="mt-1 block w-full px-3 py-2 bg-white border-2 border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input type={showPassword ? "text" : "password"} id="password" name="password" value={password} onChange={handlePasswordChange} required autoComplete="new-password" className="mt-1 block w-full px-3 py-2 bg-white border-2 border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input type={showPassword ? "text" : "password"} id="confirm-password" name="confirm-password" value={confirmPassword} onChange={handleConfirmPasswordChange} required autoComplete="new-password" className="mt-1 block w-full px-3 py-2 bg-white border-2 border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                        <button type="button" onClick={togglePasswordVisibility} className="text-indigo-600 hover:text-indigo-900 transition duration-150 ease-in-out">
                            {showPassword ? "Hide Password" : "Show Password"}
                        </button>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <div className="flex items-center">
                            <input type="radio" id="client" name="role" value="CLIENT" checked={role === "CLIENT"} onChange={handleRoleChange} className="mr-2" />
                            <label htmlFor="client" className="mr-4">Client</label>
                            <input type="radio" id="serviceProvider" name="role" value="SERVICE_PROVIDER" checked={role === "SERVICE_PROVIDER"} onChange={handleRoleChange} className="mr-2" />
                            <label htmlFor="serviceProvider">Service Provider</label>
                        </div>
                    </div>
                    <div className="flex justify-between items-center mb-6">
                        <button type="submit" className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-150 ease-in-out">
                            Create Account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
