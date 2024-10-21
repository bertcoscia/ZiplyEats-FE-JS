import { forwardRef, useState } from "react";
import { Button, Container } from "react-bootstrap";
import UserSignUpComponent from "./UserSignUpComponent";
import RiderSignUpComponent from "./RiderSignUpComponent";
import RestaurantSignUpComponent from "./RestaurantSignUpComponent";
import "./SignUpComponent.css";

const JoinUsComponent = forwardRef((props, ref) => {
  // USE STATE
  const [activeForm, setActiveForm] = useState(null);

  // HANDLERS
  const handleShow = formType => {
    setActiveForm(formType);
  };

  return (
    <div ref={ref} className="mt-3">
      <h2 className="text-center">Join Us</h2>
      <Container className="signup mt-3 mb-5 pt-5 align-items-center">
        {activeForm === null && (
          <div className="signup__options d-flex flex-column flex-lg-row justify-content-between align-items-center">
            <Button
              onClick={() => handleShow("user")}
              className="signup__element perfect-shadow border rounded-4 align-self-center py-4 px-5 text-decoration-none position-relative my-5 bg-primary text-text"
              as={Button}
              style={{ overflow: "visible" }}
            >
              <img
                className="signup__element__illustration position-absolute top-0 start-50 translate-middle mb-5"
                src="https://res.cloudinary.com/bertcoscia/image/upload/fl_preserve_transparency/v1728816897/62bdd881719b467df10901bb_7-removebg-preview_pe5i5j.jpg?_s=public-apps"
                alt=""
                style={{ width: "250px", height: "250px" }}
              />
              <h2 className="signup__element__title fs-3 text-decoration-none text-center mt-4 pt-5">Join as a Customer</h2>
            </Button>

            <Button
              onClick={() => handleShow("rider")}
              className="signup__element perfect-shadow border rounded-4 align-self-center py-4 px-5 text-decoration-none position-relative my-5 bg-primary text-text"
              as={Button}
              style={{ overflow: "visible" }}
            >
              <img
                className="signup__element__illustration position-absolute top-0 start-50 translate-middle mb-5"
                src="https://res.cloudinary.com/bertcoscia/image/upload/fl_preserve_transparency/v1728816896/62bdd882f4b18f3ffbf3a434_1-removebg-preview_pjhi7o.jpg?_s=public-apps"
                alt=""
                style={{ width: "250px", height: "250px" }}
              />
              <h2 className="signup__element__title fs-3 text-decoration-none text-center mt-4 pt-5">Ride with Us</h2>
            </Button>

            <Button
              onClick={() => handleShow("restaurant")}
              className="signup__element perfect-shadow border rounded-4 align-self-center py-4 px-5 text-decoration-none position-relative my-5 bg-primary text-text"
              as={Button}
              style={{ overflow: "visible" }}
            >
              <img
                className="signup__element__illustration position-absolute top-0 start-50 translate-middle mb-5"
                src="https://res.cloudinary.com/bertcoscia/image/upload/fl_preserve_transparency/v1728816897/62bdd8824490143ff42ae697_6-removebg-preview_hucw8p.jpg?_s=public-apps"
                alt=""
                style={{ width: "250px", height: "250px" }}
              />
              <h2 className="signup__element__title fs-3 text-decoration-none text-center mt-4 pt-5">Ziply Eats for Restaurants</h2>
            </Button>
          </div>
        )}

        {activeForm === "user" && (
          <div className="d-flex flex-column">
            <Button
              variant="accent"
              className="align-self-center mb-3 px-2 py-1"
              onClick={() => {
                setActiveForm(null);
              }}
            >
              Go back
            </Button>
            <UserSignUpComponent />
          </div>
        )}
        {activeForm === "rider" && (
          <div className="d-flex flex-column">
            <Button
              variant="accent"
              className="align-self-center mb-3 px-2 py-1"
              onClick={() => {
                setActiveForm(null);
              }}
            >
              Go back
            </Button>
            <RiderSignUpComponent />
          </div>
        )}
        {activeForm === "restaurant" && (
          <div className="d-flex flex-column">
            <Button
              variant="accent"
              className="align-self-center mb-3 px-2 py-1"
              onClick={() => {
                setActiveForm(null);
              }}
            >
              Go back
            </Button>
            <RestaurantSignUpComponent />
          </div>
        )}
      </Container>
    </div>
  );
});

JoinUsComponent.displayName = "JoinUsComponent";

export default JoinUsComponent;
