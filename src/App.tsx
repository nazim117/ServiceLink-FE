import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Service from './pages/SingleService';
import Offers from './pages/Offers';
import Appointment from './pages/Appointment';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import UserProfile from './pages/UserProfile';
import './App.css';
import { AuthProvider } from "./components/AuthContext";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/service' element={<Service/>}/>
            <Route path='/service/:serviceId/offers' element={<Offers/>}/>
            <Route path='/service/:serviceId/offers/:offersId/appointment' element={<Appointment/>}/>
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>}/>
            <Route path="/userProfile" element={<ProtectedRoute element={<UserProfile/>} />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
