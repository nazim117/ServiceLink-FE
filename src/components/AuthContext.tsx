import { createContext, useContext, useState, ReactNode } from "react";
import TokenManager from "../API/TokenManager";

// Define the default value for the context
const defaultAuthContext = {
    isAuthenticated: false,
    login: () => {},
    logout: () => {}
};
interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext(defaultAuthContext);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!TokenManager.getClaimsFromLocalStorage());

    const login = () => {
        console.log("in login");
        setIsAuthenticated(true);
    }
    const logout = () => {
        TokenManager.clear();
        setIsAuthenticated(false);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
}
