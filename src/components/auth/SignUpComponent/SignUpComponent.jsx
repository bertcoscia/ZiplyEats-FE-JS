import { Button, Container } from "react-bootstrap";
import "./SignUpComponent.css";
import { Link } from "react-router-dom";

const SignUpComponent = () => {
  return (
    <Container className="text-center my-5">
      <h1 className="mb-5">Are you a...</h1>
      <div className="d-flex flex-column flex-lg-row">
        <Link className="user-type-btn border rounded-4 align-self-center py-4 px-5 text-decoration-none position-relative mx-3" as={Button}>
          <h2 className="mt-5 fs-1 text-decoration-none position-absolute translate-middle-y">User</h2>
          <img className="illustration position-absolute bottom-0 end-0" src="https://res.cloudinary.com/bertcoscia/image/upload/fl_preserve_transparency/v1728665392/62bdd881719b467df10901bb_7_nmbcfo.jpg?_s=public-apps" alt="" />
        </Link>
        <Link className="user-type-btn border rounded-4 align-self-center py-4 px-5 text-decoration-none position-relative mx-3" as={Button}>
          <h2 className="mt-5 fs-1 text-decoration-none position-absolute translate-middle-y">Rider</h2>
          <img className="illustration position-absolute bottom-0 end-0" src="https://res.cloudinary.com/bertcoscia/image/upload/fl_preserve_transparency/v1728664914/62bdd882f4b18f3ffbf3a434_1_hzprrk.jpg?_s=public-apps" alt="" />
        </Link>
        <Link className="user-type-btn border rounded-4 align-self-center py-4 px-5 text-decoration-none position-relative mx-3" as={Button}>
          <h2 className="mt-5 fs-1 text-decoration-none position-absolute translate-middle-y">Restaurant</h2>
          <img className="illustration position-absolute bottom-0 end-0" src="https://res.cloudinary.com/bertcoscia/image/upload/fl_preserve_transparency/v1728665305/62bdd8824490143ff42ae697_6_s1cxpp.jpg?_s=public-apps" alt="" />
        </Link>
      </div>
    </Container>
  );
};

export default SignUpComponent;
