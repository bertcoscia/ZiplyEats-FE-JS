import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from "@geoapify/react-geocoder-autocomplete";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";
import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const UserSignUpComponent = () => {
  // ENV VARIABLES
  const ENV_VARIABLE = {
    GEOAPIFY_KEY: import.meta.env.VITE_GEOAPIFY_KEY,
    URL_AUTH: import.meta.env.VITE_AUTH_URL
  };

  // HOOKS
  const navigate = useNavigate();

  // USE STATE
  const [signupDTO, setSignupDTO] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
    city: "",
    longitude: null,
    latitude: null
  });

  const [passwordError, setPasswordError] = useState("");

  // HANDLERS
  const handlePasswordChange = event => {
    const { value } = event.target;
    setSignupDTO(prevState => ({
      ...prevState,
      password: value
    }));
    validatePassword(value);
  };

  const handlePlaceSelect = geoapifyResponse => {
    setSignupDTO(prevState => ({
      ...prevState,
      address: geoapifyResponse.properties.formatted,
      city: geoapifyResponse.properties.city,
      longitude: geoapifyResponse.geometry.coordinates[0],
      latitude: geoapifyResponse.geometry.coordinates[1]
    }));
  };

  const handleSubmit = event => {
    event.preventDefault();
    console.log(signupDTO);
    userSignup(signupDTO);
  };

  const handleTextChange = event => {
    const { name, value } = event.target;
    setSignupDTO(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // FETCH
  const userSignup = signupDTO => {
    fetch(`${ENV_VARIABLE.URL_AUTH}/users-signup`, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(signupDTO)
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error during registration");
        }
      })
      .then(SignupRespDTO => {
        console.log(SignupRespDTO.id);
        setSignupDTO({
          name: "",
          surname: "",
          email: "",
          password: "",
          phoneNumber: "",
          address: "",
          city: "",
          longitude: null,
          latitude: null
        });
        navigate("/login");
      })
      .catch(error => console.log(error));
  };

  // UTILS
  const validatePassword = password => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;

    if (!passwordRegex.test(password)) {
      setPasswordError("Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character.");
    } else {
      setPasswordError("");
    }
  };

  return (
    <Container className="signup my-5 px-5">
      <Form onSubmit={handleSubmit} className="signup__form perfect-shadow border rounded-4 align-self-center py-4 px-5 text-decoration-none position-relative mx-3 my-3 signup-element-btn">
        <Button as={Link} to={"/signup"} variant="link" className="text-decoration-none">
          Go back
        </Button>
        <Form.Group className="signup__form__group my-3">
          <Form.Label className="signup__form__group__label">Name</Form.Label>
          <Form.Control type="text" placeholder="Enter your name" name="name" value={signupDTO.name} onChange={handleTextChange} required />
        </Form.Group>
        <Form.Group className="signup__form__group mb-3">
          <Form.Label className="signup__form__group__label">Surname</Form.Label>
          <Form.Control type="text" placeholder="Enter your surname" name="surname" value={signupDTO.surname} onChange={handleTextChange} required />
        </Form.Group>
        <Form.Group className="signup__form__group mb-3">
          <Form.Label className="signup__form__group__label">Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" name="email" value={signupDTO.email} onChange={handleTextChange} required />
        </Form.Group>
        <Form.Group className="signup__form__group mb-3">
          <Form.Label className="signup__form__group__label">Password</Form.Label>
          <Form.Control type="password" placeholder="Password" name="password" value={signupDTO.password} onChange={handlePasswordChange} required />
          {passwordError && <p className="text-danger">{passwordError}</p>}
        </Form.Group>
        <Form.Group className="signup__form__group mb-3">
          <Form.Label className="signup__form__group__label">Phone number</Form.Label>
          <Form.Control type="text" placeholder="Insert your phone number" name="phoneNumber" value={signupDTO.phoneNumber} onChange={handleTextChange} required />
        </Form.Group>
        <Form.Group className="signup__form__group mb-3 geoapify-input">
          <Form.Label className="signup__form__group__label">Address</Form.Label>
          <GeoapifyContext className="custom-input" apiKey={ENV_VARIABLE.GEOAPIFY_KEY}>
            <GeoapifyGeocoderAutocomplete placeSelect={handlePlaceSelect} debounceDelay={700} style={{ width: "100%" }} required />
          </GeoapifyContext>
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default UserSignUpComponent;
