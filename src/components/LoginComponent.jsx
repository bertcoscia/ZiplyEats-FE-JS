import { useState } from "react";
import { Button, Container } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const LoginComponent = () => {
  const navigate = useNavigate();
  const AUTH_URL = import.meta.env.VITE_AUTH_URL;

  const [loginDTO, setLoginDTO] = useState({
    email: "",
    password: ""
  });

  const login = loginDTO => {
    fetch(`${AUTH_URL}/users-login`, {
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
          throw new Error("Error during login");
        }
      })
      .then(LoginRespDTO => {
        console.log(LoginRespDTO); // Verifica cosa restituisce il server
        localStorage.setItem("accessToken", LoginRespDTO.accessToken);
        setLoginDTO({
          email: "",
          password: ""
        });
        navigate("/home");
      })
      .catch(error => console.log(error));
  };

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

  return (
    <Container className="my-5 px-5">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" name="email" value={loginDTO.email} onChange={handleTextChange} />{" "}
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" name="password" value={loginDTO.password} onChange={handleTextChange} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default LoginComponent;
