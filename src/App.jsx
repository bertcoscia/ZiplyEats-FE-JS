import "./sass/style.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthComponent from "./components/auth/AuthComponent/AuthComponent";
import LoginComponent from "./components/auth/LoginComponent/LoginComponent";
import SignUpComponent from "./components/auth/SignUpComponent/SignUpComponent";
import UserSignUpComponent from "./components/auth/SignUpComponent/UserSignUpComponent";
import RiderSignUpComponent from "./components/auth/SignUpComponent/RiderSignUpComponent";
import RestaurantSignUpComponent from "./components/auth/SignUpComponent/RestaurantSignUpComponent";
import HomeComponent from "./components/home/HomeComponent";
import PastOrdersComponent from "./components/PastOrdersComponent/PastOrdersComponent";
import ProfileComponent from "./components/profile/ProfileComponent";
import EditMenuComponent from "./components/home/RestaurantDashboardComponent/EditMenuComponent/EditMenuComponent";

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
          <Route path="/me" element={<ProfileComponent />} />
          <Route path="/home" element={<HomeComponent />} />
          <Route path="/past-orders" element={<PastOrdersComponent />} />
          <Route path="/edit-menu" element={<EditMenuComponent />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
