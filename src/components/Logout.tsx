import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Logout = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm("Are you sure you want to logout?")) {
            logout();
            navigate('/');
        }
    }

    return (
        <form className="logout" onSubmit={(e) => { e.preventDefault(); handleLogout(); }}>
            <button type="submit">LOGOUT</button>
        </form>
    );
}

export default Logout;
