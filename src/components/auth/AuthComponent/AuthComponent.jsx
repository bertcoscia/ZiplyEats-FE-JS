import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const AuthComponent = () => {
  return (
    <Container className="text-center my-5">
      <h1>Welcome to Ziply Eats</h1>
      <Container className="d-flex flex-column">
        <Button className="align-self-center my-3 px-3 py-2 rounded-pill" as={Link} to={"/login"}>
          Login
        </Button>
        <Button className="align-self-center my-3 px-3 py-2 rounded-pill" as={Link} to={"/signup"}>
          Sign up
        </Button>
      </Container>
    </Container>
  );
};

export default AuthComponent;
