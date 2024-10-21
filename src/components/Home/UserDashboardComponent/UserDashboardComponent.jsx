import { Button, Container, Form } from "react-bootstrap";
import NavComponent from "../../NavComponent/NavComponent";
import { GeoapifyContext, GeoapifyGeocoderAutocomplete } from "@geoapify/react-geocoder-autocomplete";
import { useEffect, useRef, useState } from "react";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";
import "./UserDahsboardComponent.css";
import { Link, useNavigate } from "react-router-dom";
import InfiniteScrollCarousel from "../../InfiniteScrollCarousel/InfiniteScrollCarousel";
import SignUpComponent from "../../auth/SignUpComponent/SignUpComponent";
import LocalRestaurantsComponent from "../../LocalRestaurantsComponent/LocalRestaurantsComponent";
import { useSelector } from "react-redux";

const UserDashboardComponent = () => {
  // ENV VARIABLES
  const ENV_VARIABLE = {
    GEOAPIFY_KEY: import.meta.env.VITE_GEOAPIFY_KEY
  };

  // HOOKS
  const signUpRef = useRef(null);
  const navigate = useNavigate();
  const profile = useSelector(state => state.profile.content);

  // USE STATE
  const [deliveryAddress, setDeliveryAddress] = useState({
    address: "",
    city: "",
    longitude: null,
    latitude: null
  });

  // HANDLERS
  const handlePlaceSelect = geoapifyResponse => {
    setDeliveryAddress(prevState => ({
      ...prevState,
      address: geoapifyResponse.properties.formatted,
      city: geoapifyResponse.properties.city,
      longitude: geoapifyResponse.geometry.coordinates[0],
      latitude: geoapifyResponse.geometry.coordinates[1]
    }));
  };

  const handleSubmit = () => {
    navigate(`/local-restaurants/${deliveryAddress.city}/${deliveryAddress.longitude}/${deliveryAddress.latitude}`);
  };

  // FETCH
  const useMyAddress = async () => {
    try {
      const formattedAddress = formatAddress(profile.address);
      const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${formattedAddress}&lang=en&limit=1&type=street&format=json&apiKey=${ENV_VARIABLE.GEOAPIFY_KEY}`);
      if (response.ok) {
        const data = await response.json();
        navigate(`/local-restaurants/${data.results[0].city}/${data.results[0].lon}/${data.results[0].lat}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // UTILS
  const scrollToJoinUs = () => {
    signUpRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const formatAddress = address => {
    return encodeURIComponent(address);
  };

  // USE EFFECT
  useEffect(() => {}, []);

  return (
    <>
      <NavComponent scrollToJoinUs={scrollToJoinUs} />

      <div style={{ marginTop: "80px" }}>
        {/* HERO SECTION */}
        <div className="bg-primary">
          <Container className="d-flex align-items-center">
            <Container style={{ maxWidth: "445px" }} className="py-5 ms-lg-0">
              <h1 className="mb-5 text-center text-md-start">
                Fresh Flavours <br />
                Fast Delivery
              </h1>
              <Form className="card perfect-shadow p-3 d-flex mt-5 bg-background" onSubmit={handleSubmit}>
                <Form.Group className="signup__form__group mb-3">
                  <Form.Label className="small mb-3">Enter your address to find local restaurants</Form.Label>
                  <GeoapifyContext className="custom-input" apiKey={ENV_VARIABLE.GEOAPIFY_KEY}>
                    <GeoapifyGeocoderAutocomplete placeSelect={handlePlaceSelect} debounceDelay={700} />
                  </GeoapifyContext>
                  {localStorage.getItem("accessToken") && profile?.address && (
                    <Button variant="link" className="small px-0" onClick={useMyAddress}>
                      Use my address
                    </Button>
                  )}
                </Form.Group>
                <Button variant="accent" className="align-self-center px-3 py-1 rounded-pill" onClick={handleSubmit}>
                  Search
                </Button>
              </Form>
            </Container>
            <div className="d-none d-md-inline pt-md-5">
              <img src="https://res.cloudinary.com/bertcoscia/image/upload/fl_preserve_transparency/v1729431457/tasty-burger-isolated-white-background-fresh-hamburger-fastfood-with-beef-cheese_pagnte.jpg?_s=public-apps" alt="" className="hero-img" />
            </div>
          </Container>
        </div>

        {/* CAROUSEL SECTION */}
        <InfiniteScrollCarousel />

        {/* JOIN US SECTION */}
        <SignUpComponent ref={signUpRef} />
      </div>
    </>
  );
};

export default UserDashboardComponent;

{
  /* <div id="join-us" ref={joinUsRef} className="mt-5">
          <h2 className="text-center">Join Us</h2>
          <Container className="signup my-5 pt-5 align-items-center">
            <div className="signup__options d-flex flex-column flex-lg-row justify-content-between align-items-center">
              <Link to={"/signup/user"} className="signup__element perfect-shadow border rounded-4 align-self-center py-4 px-5 text-decoration-none position-relative my-5 bg-primary text-text" as={Button} style={{ overflow: "visible" }}>
                <img
                  className="signup__element__illustration position-absolute top-0 start-50 translate-middle mb-5"
                  src="https://res.cloudinary.com/bertcoscia/image/upload/fl_preserve_transparency/v1728816897/62bdd881719b467df10901bb_7-removebg-preview_pe5i5j.jpg?_s=public-apps"
                  alt=""
                  style={{ width: "250px", height: "250px" }}
                />
                <h2 className="signup__element__title fs-3 text-decoration-none text-center mt-4 pt-5">Join as a Customer</h2>
              </Link>

              <Link to={"/signup/rider"} className="signup__element perfect-shadow border rounded-4 align-self-center py-4 px-5 text-decoration-none position-relative my-5 bg-primary text-text" as={Button} style={{ overflow: "visible" }}>
                <img
                  className="signup__element__illustration position-absolute top-0 start-50 translate-middle mb-5"
                  src="https://res.cloudinary.com/bertcoscia/image/upload/fl_preserve_transparency/v1728816896/62bdd882f4b18f3ffbf3a434_1-removebg-preview_pjhi7o.jpg?_s=public-apps"
                  alt=""
                  style={{ width: "250px", height: "250px" }}
                />
                <h2 className="signup__element__title fs-3 text-decoration-none text-center mt-4 pt-5">Ride with Us</h2>
              </Link>

              <Link to={"/signup/restaurant"} className="signup__element perfect-shadow border rounded-4 align-self-center py-4 px-5 text-decoration-none position-relative my-5 bg-primary text-text" as={Button} style={{ overflow: "visible" }}>
                <img
                  className="signup__element__illustration position-absolute top-0 start-50 translate-middle mb-5"
                  src="https://res.cloudinary.com/bertcoscia/image/upload/fl_preserve_transparency/v1728816897/62bdd8824490143ff42ae697_6-removebg-preview_hucw8p.jpg?_s=public-apps"
                  alt=""
                  style={{ width: "250px", height: "250px" }}
                />
                <h2 className="signup__element__title fs-3 text-decoration-none text-center mt-4 pt-5">Ziply Eats for Restaurants</h2>
              </Link>
            </div>
          </Container>
        </div> */
}
