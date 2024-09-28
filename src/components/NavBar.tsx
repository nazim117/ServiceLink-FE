import { Link } from "react-router-dom";
import TokenManager from "../API/TokenManager";
import Logout from "./Logout";
import { useAuth } from "./AuthContext";
import { useEffect, useState} from "react";
import serviceAPI from "../API/serviceAPI";

function NavBar() {
    const {isAuthenticated} = useAuth();
    const claims = TokenManager.getClaimsFromLocalStorage();
    const [profileName, setProfileName] = useState(String)

    useEffect(() => {
        const fetchServiceAndOffers = async () => {
            try {
                const res = await serviceAPI.getServiceByUserId(claims?.userId);
                const profileName = res.name ? res.name.replace(/\s+/g, '-').toLowerCase() : '';
                setProfileName(profileName);    
            } catch (error: unknown) {
                // Type guard to ensure error is an instance of Error
                if (error instanceof Error) {
                  if (error.message === 'Service not found') {
                    console.error("Service not found:", error);
                  } else {
                    console.error("An unexpected error occurred:", error);
                  }
                } else {
                  console.error("An unexpected error occurred:", error);
                }
              }
        };
    
        fetchServiceAndOffers();
    }, [claims?.userId]);

    return (
        <nav className="bg-white shadow-md py-4">
            <div className="container mx-auto flex justify-between items-center px-4">
                <Link className="flex items-center text-blue-500 hover:text-blue-700" to="/">
                    <img src="/Quickserve_Logo.jpg" alt="Quickserve Logo" className="h-10 mr-2" />
                    <span className="font-bold text-xl">Quickserve</span>
                </Link>
                <div className="flex items-center space-x-4">
                    <ul className="flex space-x-4">
                        {claims && (claims.roles.includes("ADMIN")) && (
                            <>
                                <li className="nav-item">
                                    <Link className="text-gray-700 hover:text-blue-500" to="/users">USERS</Link>
                                </li>
                            </>
                        )}
                        {claims && (claims.roles.includes("SERVICE_PROVIDER")) && (
                            <>
                                <li className="nav-item">
                                    <Link className="text-gray-700 hover:text-blue-500" to={`${profileName}`}>SERVICE</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="text-gray-700 hover:text-blue-500" to="/booked-appointments">BOOKING</Link>
                                </li>
                            </>
                        )}
                    </ul>
                    {isAuthenticated ? (
                        <div className="flex items-center space-x-4">
                            <Link className="text-gray-700 hover:text-blue-500 flex items-center" to="/userProfile">
                                <i className="fa fa-user mr-2" aria-hidden="true"></i>PROFILE
                            </Link>
                            <Logout />
                        </div>
                    ) : (
                        <Link className="text-gray-700 hover:text-blue-500" to="/login">LOGIN</Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
