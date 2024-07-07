import TokenManager from "../API/TokenManager";
import Logout from "./Logout";

function NavBar() {
    const claims = TokenManager.getClaimsFromLocalStorage();

    return (
        <nav className="bg-white shadow-md py-4">
            <div className="container mx-auto flex justify-between items-center px-4">
                <a className="flex items-center text-blue-500 hover:text-blue-700" href="/">
                    <img src="/ServiceLink_Logo.png" alt="ServiceLink Logo" className="h-10 mr-2" />
                    <span className="font-bold text-xl">ServiceLink</span>
                </a>
                <div className="flex items-center space-x-4">
                    <ul className="flex space-x-4">
                        {claims && (claims.roles.includes("ADMIN")) && (
                            <>
                                <li className="nav-item">
                                    <a className="text-gray-700 hover:text-blue-500" href="/users">USERS</a>
                                </li>
                            </>
                        )}
                        {claims && (claims.roles.includes("SERVICE_PROVIDER")) && (
                            <>
                                <li className="nav-item">
                                    <a className="text-gray-700 hover:text-blue-500" href="/service-profile">SERVICE</a>
                                </li>
                            </>
                        )}
                    </ul>
                    {claims ? (
                        <div className="flex items-center space-x-4">
                            <a className="text-gray-700 hover:text-blue-500 flex items-center" href="/userProfile">
                                <i className="fa fa-user mr-2" aria-hidden="true"></i>PROFILE
                            </a>
                            <Logout />
                        </div>
                    ) : (
                        <a className="text-gray-700 hover:text-blue-500" href="/login">LOGIN</a>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
