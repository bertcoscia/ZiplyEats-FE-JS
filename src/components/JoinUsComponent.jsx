import { forwardRef, useState } from "react";
import { Button, Container, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import UserSignUpComponent from "./auth/SignUpComponent/UserSignUpComponent";
import RiderSignUpComponent from "./auth/SignUpComponent/RiderSignUpComponent";
import RestaurantSignUpComponent from "./auth/SignUpComponent/RestaurantSignUpComponent";

const JoinUsComponent = forwardRef((props, ref) => {
  // USE STATE
  const [showUserSignUp, setShowUserSignUp] = useState(false);
  const [showRiderSignUp, setShowRiderSignUp] = useState(false);
  const [showRestaurantSignUp, setShowRestaurantSignUp] = useState(false);

  // HANDLERS
  const handleShow = field => {
    switch (field) {
      case "user":
        setShowUserSignUp(true);
        break;
      case "rider":
        setShowRiderSignUp(true);
        break;
      case "restaurant":
        setShowRestaurantSignUp(true);
        break;
    }
  };

  const handleClose = field => {
    switch (field) {
      case "user":
        setShowUserSignUp(false);
        break;
      case "rider":
        setShowRiderSignUp(false);
        break;
      case "restaurant":
        setShowRestaurantSignUp(false);
        break;
    }
  };

  return (
    <div ref={ref} className="mt-5">
      {/* <h2 className="text-center">Join Us</h2> */}
      <Container className="signup my-5 pt-5 align-items-center">
        <div className="signup__options d-flex flex-column flex-lg-row justify-content-between align-items-center">
          <Button
            onClick={() => {
              handleShow("user");
            }}
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
            {showUserSignUp && <UserSignUpComponent />}
          </Button>

          <Button
            onClick={() => {
              handleShow("rider");
            }}
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
            <Modal
              show={showRiderSignUp}
              onHide={() => {
                handleClose("rider");
              }}
              className="profile__modal perfect-shadow"
              onClick={event => event.stopPropagation()}
            >
              <Modal.Header closeButton className="profile__modal-header border-bottom-0" onClick={event => event.stopPropagation()}></Modal.Header>
              <Modal.Body className="profile__modal-body">
                <RiderSignUpComponent />
              </Modal.Body>
            </Modal>
          </Button>

          <Button
            onClick={() => {
              handleShow("restaurant");
            }}
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
            <Modal
              show={showRestaurantSignUp}
              onHide={() => {
                handleClose("restaurant");
              }}
              className="profile__modal perfect-shadow"
              onClick={event => event.stopPropagation()}
            >
              <Modal.Header closeButton className="profile__modal-header border-bottom-0" onClick={event => event.stopPropagation()}></Modal.Header>
              <Modal.Body className="profile__modal-body">
                <RestaurantSignUpComponent />
              </Modal.Body>
            </Modal>
          </Button>
        </div>
      </Container>
    </div>
  );
});

JoinUsComponent.displayName = "JoinUsComponent";

export default JoinUsComponent;
