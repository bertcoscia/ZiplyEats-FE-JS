import { Button, Container } from "react-bootstrap";
import "./SignUpComponent.css";
import { Link } from "react-router-dom";
import "animate.css";

const SignUpComponent = () => {
  return (
    <Container className="signup text-center my-5">
      <h1 className="signup__title mb-5">Are you a...</h1>
      <div className="w-100">
        <Link to={"/"} className="signup__link pb-5 text-decoration-none d-inline-block">
          Go back
        </Link>
      </div>
      <div className="signup__options d-flex flex-column flex-lg-row">
        <Link to={"/signup/user"} className="signup__element perfect shadow animate__animated animate__zoomIn signup-element-btn border rounded-4 align-self-center py-4 px-5 text-decoration-none position-relative mx-3 my-3" as={Button}>
          <h2 className="signup__element__title mt-5 fs-1 text-decoration-none position-absolute translate-middle-y">User</h2>
          <img
            className="signup__element__illustration position-absolute bottom-0 end-0 my-3"
            src="https://res.cloudinary.com/bertcoscia/image/upload/fl_preserve_transparency/v1728665392/62bdd881719b467df10901bb_7_nmbcfo.jpg?_s=public-apps"
            alt=""
          />
        </Link>
        <Link to={"/signup/rider"} className="signup__element perfect shadow animate__animated animate__zoomIn signup-element-btn border rounded-4 align-self-center py-4 px-5 text-decoration-none position-relative mx-3 my-3" as={Button}>
          <h2 className="signup__element__title mt-5 fs-1 text-decoration-none position-absolute translate-middle-y">Rider</h2>
          <img
            className="signup__element__illustration position-absolute bottom-0 end-0 my-3"
            src="https://res.cloudinary.com/bertcoscia/image/upload/fl_preserve_transparency/v1728664914/62bdd882f4b18f3ffbf3a434_1_hzprrk.jpg?_s=public-apps"
            alt=""
          />
        </Link>
        <Link to={"/signup/restaurant"} className="signup__element perfect shadow animate__animated animate__zoomIn signup-element-btn border rounded-4 align-self-center py-4 px-5 text-decoration-none position-relative mx-3 my-3" as={Button}>
          <h2 className="signup__element__title mt-5 fs-1 text-decoration-none position-absolute translate-middle-y">Restaurant</h2>
          <img
            className="signup__element__illustration position-absolute bottom-0 end-0 px-lg-3"
            src="https://res.cloudinary.com/bertcoscia/image/upload/fl_preserve_transparency/v1728665305/62bdd8824490143ff42ae697_6_s1cxpp.jpg?_s=public-apps"
            alt=""
          />
        </Link>
      </div>
    </Container>
  );
};

export default SignUpComponent;
