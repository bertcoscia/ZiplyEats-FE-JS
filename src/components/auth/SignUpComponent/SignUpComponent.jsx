import { Button, Container } from "react-bootstrap";
import "./SignUpComponent.css";
import { Link } from "react-router-dom";
import "animate.css";

const SignUpComponent = () => {
  return (
    <Container className="signup my-5 pt-5 align-items-center">
      <div className="signup__options d-flex flex-column flex-lg-row justify-content-between align-items-center">
        <Link to={"/signup/user"} className="signup__element perfect-shadow border rounded-4 align-self-center py-4 px-5 text-decoration-none position-relative my-3" as={Button} style={{ overflow: "visible" }}>
          <img
            className="signup__element__illustration position-absolute top-0 start-50 translate-middle mb-5"
            src="https://res.cloudinary.com/bertcoscia/image/upload/fl_preserve_transparency/v1728816897/62bdd881719b467df10901bb_7-removebg-preview_pe5i5j.jpg?_s=public-apps"
            alt=""
            style={{ width: "250px", height: "250px" }}
          />
          <h2 className="signup__element__title fs-3 text-decoration-none text-center mt-4 pt-5">Join as a Customer</h2>
        </Link>

        <Link to={"/signup/rider"} className="signup__element perfect-shadow border rounded-4 align-self-center py-4 px-5 text-decoration-none position-relative my-3" as={Button} style={{ overflow: "visible" }}>
          <img
            className="signup__element__illustration position-absolute top-0 start-50 translate-middle mb-5"
            src="https://res.cloudinary.com/bertcoscia/image/upload/fl_preserve_transparency/v1728816896/62bdd882f4b18f3ffbf3a434_1-removebg-preview_pjhi7o.jpg?_s=public-apps"
            alt=""
            style={{ width: "250px", height: "250px" }}
          />
          <h2 className="signup__element__title fs-3 text-decoration-none text-center mt-4 pt-5">Become a Rider</h2>
        </Link>

        <Link to={"/signup/restaurant"} className="signup__element perfect-shadow border rounded-4 align-self-center py-4 px-5 text-decoration-none position-relative my-3" as={Button} style={{ overflow: "visible" }}>
          <img
            className="signup__element__illustration position-absolute top-0 start-50 translate-middle mb-5"
            src="https://res.cloudinary.com/bertcoscia/image/upload/fl_preserve_transparency/v1728816897/62bdd8824490143ff42ae697_6-removebg-preview_hucw8p.jpg?_s=public-apps"
            alt=""
            style={{ width: "250px", height: "250px" }}
          />
          <h2 className="signup__element__title fs-3 text-decoration-none text-center mt-4 pt-5">Join as a Restaurant</h2>
        </Link>
      </div>
      <div className="w-100">
        <Link to={"/"} className="go-back__link mt-3 text-start text-decoration-none d-inline-block ">
          Go back
        </Link>
      </div>
    </Container>
  );
};

export default SignUpComponent;
