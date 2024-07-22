const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8080/api";
console.log('Environment Variable:', process.env.REACT_APP_BASE_URL);
console.log("base url: ", BASE_URL );

const baseUrl = {
    services: `${BASE_URL}/services`,
    offers: `${BASE_URL}/offers`,
    tokens: `${BASE_URL}/tokens`,
    appointments: `${BASE_URL}/appointments`,
    users: `${BASE_URL}/users`,
}

export default baseUrl;