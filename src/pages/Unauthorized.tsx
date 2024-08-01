import { Link } from "react-router-dom";

function Unauthorized() {
    return(
        <div className="container">
            <h1>401 Unauthorized</h1>
            <p>You don't have permission to acces this page.</p>
            <div className="options">
                <p>Please try the following: </p>
                <ul>
                    <li>Check if you are logged in.</li>
                    <li>Ensure you have the correct permissions to acces this resource.</li>
                    <li>Return to the <Link to="/">Home page</Link>.</li>
                    <li>Contact support if you believe this is a mistake.</li>
                </ul>
            </div>
        </div>
    )
}

export default Unauthorized;