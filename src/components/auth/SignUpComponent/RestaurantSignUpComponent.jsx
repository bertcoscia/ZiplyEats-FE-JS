import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from "@geoapify/react-geocoder-autocomplete";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";
import { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import LoginComponent from "../LoginComponent/LoginComponent";

const RestaurantSignUpComponent = () => {
  // ENV VARIABLES
  const ENV_VARIABLE = {
    GEOAPIFY_KEY: import.meta.env.VITE_GEOAPIFY_KEY,
    URL_AUTH: import.meta.env.VITE_AUTH_URL,
    URL_RESTAURANT_CATEGORIES: import.meta.env.VITE_RESTAURANT_CATEGORIES_URL
  };

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
    latitude: null,
    restaurantCategory: ""
  });

  const [isSignedUp, setIsSignedUp] = useState(false);

  const [restaurantCategories, setRestaurantCategories] = useState([]);

  const [passwordError, setPasswordError] = useState("");

  // HANDLERS
  const handleTextChange = event => {
    const { name, value } = event.target;
    setSignupDTO(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

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
    restaurantSignup(signupDTO);
  };

  // FETCH
  const getRestaurantCategories = () => {
    fetch(`${ENV_VARIABLE.URL_RESTAURANT_CATEGORIES}/list`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error during restaurant categories fetch - @RestaurantSignUpComponent");
        }
      })
      .then(data => {
        setRestaurantCategories(data);
      })
      .catch(error => console.log(error));
  };

  const restaurantSignup = signupDTO => {
    fetch(`${ENV_VARIABLE.URL_AUTH}/restaurants-signup`, {
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
          address: "",
          city: "",
          email: "",
          password: "",
          phoneNumber: "",
          restaurantCategory: "",
          latitude: null,
          longitude: null
        });
        setIsSignedUp(true);
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

  // USE EFFECT
  useEffect(() => {
    getRestaurantCategories();
  }, []);

  return (
    <Container className="signup mx-auto card perfect-shadow" style={{ maxWidth: "75%" }}>
      {!isSignedUp && (
        <>
          <h2 className="text-center mt-3">Restaurant</h2>
          <Form onSubmit={handleSubmit} className="signup__form mx-3">
            <Form.Group className="signup__form__group my-3">
              <Form.Label className="signup__form__group__label">Name</Form.Label>
              <Form.Control type="text" placeholder="Enter your name" name="name" value={signupDTO.name} onChange={handleTextChange} required />
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
              <Form.Label className="signup__form__group__label">Landline phone number</Form.Label>
              <Form.Control type="text" placeholder="Insert your phone number" name="phoneNumber" value={signupDTO.phoneNumber} onChange={handleTextChange} required />
            </Form.Group>
            <Form.Group className="signup__form__group mb-3 geoapify-input">
              <Form.Label className="signup__form__group__label">Address</Form.Label>
              <GeoapifyContext className="custom-input" apiKey={ENV_VARIABLE.GEOAPIFY_KEY}>
                <GeoapifyGeocoderAutocomplete placeSelect={handlePlaceSelect} debounceDelay={700} style={{ width: "100%" }} required />
              </GeoapifyContext>
            </Form.Group>
            {restaurantCategories.length > 0 && (
              <Form.Group className="mb-3" name="restaurantCategory">
                <Form.Label className="signup__form__group__label">Restaurant category</Form.Label>
                <Form.Select name="restaurantCategory" value={signupDTO.restaurantCategory} onChange={handleTextChange}>
                  <option value="">Category</option>
                  {restaurantCategories
                    .sort((a, b) => a.restaurantCategory.localeCompare(b.restaurantCategory))
                    .map((category, index) => (
                      <option key={index} value={category.restaurantCategory}>
                        {category.restaurantCategory}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
            )}
            <div className="d-flex justify-content-center mb-3">
              <Button variant="accent" type="submit">
                Sign up
              </Button>
            </div>
          </Form>
        </>
      )}
      {isSignedUp && <LoginComponent />}
    </Container>
  );
};

export default RestaurantSignUpComponent;
