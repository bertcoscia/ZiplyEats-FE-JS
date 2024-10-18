import { useEffect } from "react";
import { Button, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const AuthComponent = () => {
  // HOOKS
  const navigate = useNavigate();

  // USE EFFECT
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      navigate("/home");
    }
  }, [navigate]);

  return (
    <Container className="auth text-center my-5">
      <h1 className="auth__title">Welcome to Ziply Eats</h1>
      <Container className="auth__button-container d-flex flex-column">
        <Button className="auth__button align-self-center my-3 px-3 py-2 rounded-pill" as={Link} to={"/login"}>
          Login
        </Button>
        <Button className="auth__button align-self-center my-3 px-3 py-2 rounded-pill" as={Link} to={"/signup"}>
          Sign up
        </Button>
      </Container>
    </Container>
  );
};

export default AuthComponent;
