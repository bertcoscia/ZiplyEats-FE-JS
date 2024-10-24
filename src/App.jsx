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
import UserDashboardComponent from "./components/Home/UserDashboardComponent/UserDashboardComponent";
import LocalRestaurantsComponent from "./components/LocalRestaurantsComponent/LocalRestaurantsComponent";
import RestaurantsByCategoryComponent from "./components/RestaurantsByCategoryComponent/RestaurantsByCategoryComponent";
import RestaurantComponent from "./components/RestaurantComponent/RestaurantComponent";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutSuccess from "./components/stripe/CheckoutSuccess";

function App() {
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);
  return (
    <Elements stripe={stripePromise}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserDashboardComponent />} />
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/signup" element={<SignUpComponent />} />
          <Route path="/signup/user" element={<UserSignUpComponent />} />
          <Route path="/signup/rider" element={<RiderSignUpComponent />} />
          <Route path="/signup/restaurant" element={<RestaurantSignUpComponent />} />
          <Route path="/me" element={<ProfileComponent />} />
          <Route path="/home" element={<HomeComponent />} />
          <Route path="/past-orders" element={<PastOrdersComponent />} />
          <Route path="/edit-menu" element={<EditMenuComponent />} />
          <Route path="/local-restaurants" element={<LocalRestaurantsComponent />} />
          <Route path="/restaurants/:category" element={<RestaurantsByCategoryComponent />} />
          <Route path="/restaurant/:id" element={<RestaurantComponent />} />
          <Route path="/success/:idOrder" element={<CheckoutSuccess />} />
        </Routes>
      </BrowserRouter>
    </Elements>
  );
}

export default App;
