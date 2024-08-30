import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Service from './pages/SingleService';
import Appointment from './pages/Appointment';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import UserProfile from './pages/UserProfile';
import './App.css';
import { AuthProvider } from "./components/AuthContext";
import NavBar from "./components/NavBar";
import SingleService from "./pages/SingleService";
import ServiceProfile from "./pages/ServiceProfile";
import Unauthorized from "./pages/Unauthorized";
import usePageTracking from "./usePageTracking"; 
import AppointmentsPage from "./pages/AppointmentManager";

function App() {
  return (
    <div className="App min-h-screen flex flex-col bg-[#eef0e7]">
      <AuthProvider>
        <Router>
          <NavBar />
          <PageTracker />
          <div className="main-content flex-grow container mx-auto py-8 px-4 bg-[#a8c6c6] rounded shadow-lg">
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/service' element={<Service />} />
              <Route path='/service/:serviceId' element={<SingleService />} />
              <Route path='/service/:serviceId/offers/:offerId/appointment' element={<Appointment />} />
              <Route path="/appointmentmanager" element={<AppointmentsPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/userProfile" element={<ProtectedRoute element={<UserProfile />} />} />
              <Route path="/service-profile" element={<ProtectedRoute element={<ServiceProfile />} />} />
              <Route path="/unauthorized" element={<Unauthorized/>}/>
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </div>
  );
}

function PageTracker() {
  usePageTracking();
  return null;
}

export default App;
