import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthComponent from "./components/auth/AuthComponent/AuthComponent";
import LoginComponent from "./components/auth/LoginComponent/LoginComponent";
import SignUpComponent from "./components/auth/SignUpComponent/SignUpComponent";
import UserSignUpComponent from "./components/auth/SignUpComponent/UserSignUpComponent";
import RiderSignUpComponent from "./components/auth/SignUpComponent/RiderSignUpComponent";
import RestaurantSignUpComponent from "./components/auth/SignUpComponent/RestaurantSignUpComponent";
import HomeComponent from "./components/home/HomeComponent";
import ProfileComponent from "./components/Profile/ProfileComponent";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthComponent />} />
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/signup" element={<SignUpComponent />} />
          <Route path="/signup/user" element={<UserSignUpComponent />} />
          <Route path="/signup/rider" element={<RiderSignUpComponent />} />
          <Route path="/signup/restaurant" element={<RestaurantSignUpComponent />} />
          <Route path="/home" element={<HomeComponent />} />
          <Route path="/me" element={<ProfileComponent />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
