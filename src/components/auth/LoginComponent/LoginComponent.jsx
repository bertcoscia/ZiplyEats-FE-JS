import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const LoginComponent = () => {
  // ENV VARIABLES
  const ENV_VARIABLE = {
    URL_AUTH: import.meta.env.VITE_AUTH_URL
  };

  // HOOKS
  const navigate = useNavigate();

  // USE STATE
  const [loginDTO, setLoginDTO] = useState({
    email: "",
    password: ""
  });

  const [loginError, setLoginError] = useState(false);

  // HANDLERS
  const handleSubmit = event => {
    event.preventDefault();
    login(loginDTO);
  };

  const handleTextChange = event => {
    const { name, value } = event.target;
    setLoginDTO(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // FETCH
  const login = loginDTO => {
    fetch(`${ENV_VARIABLE.URL_AUTH}/users-login`, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(loginDTO)
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          setLoginError(true);
          throw new Error("Error during login");
        }
      })
      .then(LoginRespDTO => {
        localStorage.setItem("accessToken", LoginRespDTO.accessToken);
        setLoginDTO({
          email: "",
          password: ""
        });
        navigate("/home");
      })
      .catch(error => console.log(error));
  };

  return (
    <Container className="login p-3" style={{ maxWidth: "75%" }}>
      <Form onSubmit={handleSubmit} className="login__form">
        <h1 className="text-center">Login</h1>
        <Form.Group className="login__form__group my-3" controlId="formBasicEmail">
          <Form.Label className="login__form__label">Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" name="email" value={loginDTO.email} onChange={handleTextChange} className="login__form__input" required />
        </Form.Group>
        <Form.Group className="login__form__group mb-3" controlId="formBasicPassword">
          <Form.Label className="login__form__label">Password</Form.Label>
          <Form.Control type="password" placeholder="Password" name="password" value={loginDTO.password} onChange={handleTextChange} className="login__form__input" required />
        </Form.Group>
        {loginError && <p className="text-danger">Wrong password and/or email</p>}
        <div className="d-flex justify-content-center">
          <Button variant="accent" type="submit" className="login__form__submit">
            Submit
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default LoginComponent;
