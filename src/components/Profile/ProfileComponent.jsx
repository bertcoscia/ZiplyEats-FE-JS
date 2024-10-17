import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfileAction } from "../../redux/actions";
import { Button, Col, Container, Form, FormControl, InputGroup, Modal, Row } from "react-bootstrap";
import NavComponent from "../navbar/NavComponent";
import { useNavigate } from "react-router-dom";
import { GeoapifyContext, GeoapifyGeocoderAutocomplete } from "@geoapify/react-geocoder-autocomplete";
import { Geo } from "react-bootstrap-icons";

const ProfileComponent = () => {
  // ENV VARIABLES
  const ENV_VARIABLE = {
    URL_RESTAURANTS: import.meta.env.VITE_RESTAURANTS_URL,
    URL_USERS: import.meta.env.VITE_USERS_URL,
    URL_RIDERS: import.meta.env.VITE_RIDERS_URL,
    GEOAPIFY_KEY: import.meta.env.VITE_GEOAPIFY_KEY
  };

  // HOOKS
  const profile = useSelector(state => state.profile.content);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // USE STATE - MODALS
  const [showName, setShowName] = useState(false);
  const [showFullName, setShowFullName] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [showProfilePic, setShowProfilePic] = useState(false);
  const [showAddress, setShowAddress] = useState(false);

  // USE STATE - PAYLOADS
  const [name, setName] = useState({ name: "" });
  const [fullName, setFullName] = useState({ name: "", surname: "" });
  const [email, setEmail] = useState({ email: "" });
  const [password, setPassword] = useState({ currentPassword: "", newPassword: "" });
  const [phoneNumber, setPhoneNumber] = useState({ phoneNumber: "" });
  const [editFullNameUrl, setEditFullNameUrl] = useState("");
  const [address, setAddress] = useState({
    address: "",
    city: "",
    latitude: null,
    longitude: null
  });

  // USE STATE - OTHERS
  const [img, setImg] = useState(null);
  const [errorGeoapify, setErrorGeoapify] = useState("");
  const [geoapifyResponse, setGeoapifyResponse] = useState(null);
  const [geoapifyInputValue, setGeoapifyInputValue] = useState("");

  // HANDLERS
  const handleChangePic = event => {
    setImg(event.target.files[0]);
  };

  const handleClose = field => {
    switch (field) {
      case "name":
        setShowName(false);
        break;
      case "fullName":
        setShowFullName(false);
        break;
      case "email":
        setShowEmail(false);
        break;
      case "password":
        setShowPassword(false);
        break;
      case "phoneNumber":
        setShowPhoneNumber(false);
        break;
      case "profilePic":
        setShowProfilePic(false);
        break;
      case "address":
        setShowAddress(false);
        break;
      default:
        break;
    }
  };

  const handleShow = field => {
    switch (field) {
      case "name":
        setShowName(true);
        break;
      case "fullName":
        setShowFullName(true);
        break;
      case "email":
        setShowEmail(true);
        break;
      case "password":
        setShowPassword(true);
        break;
      case "phoneNumber":
        setShowPhoneNumber(true);
        break;
      case "profilePic":
        setShowProfilePic(true);
        break;
      case "address":
        setShowAddress(true);
        break;
      default:
        break;
    }
  };

  const handlePlaceSelect = geoapifyResponse => {
    setGeoapifyResponse(geoapifyResponse);
    setAddress(prevState => ({
      ...prevState,
      address: geoapifyResponse.properties.formatted,
      city: geoapifyResponse.properties.city,
      longitude: geoapifyResponse.geometry.coordinates[0],
      latitude: geoapifyResponse.geometry.coordinates[1]
    }));
    setErrorGeoapify("");
  };

  const handleChange = (field, event) => {
    const { name, value } = event.target;
    switch (field) {
      case "name":
        setName(prevState => ({
          ...prevState,
          [name]: value
        }));
        break;
      case "fullName":
        setFullName(prevState => ({
          ...prevState,
          [name]: value
        }));
        break;
      case "email":
        setEmail(prevState => ({
          ...prevState,
          [name]: value
        }));
        break;
      case "password":
        setPassword(prevState => ({
          ...prevState,
          [name]: value
        }));
        break;
      case "phoneNumber":
        setPhoneNumber(prevState => ({
          ...prevState,
          [name]: value
        }));
        break;
      default:
        break;
    }
  };

  const handleGeoapifyError = error => {
    console.error("Geoapify Error:", error);
    setErrorGeoapify("There are no results. Please try again");
  };

  const handleGeoapifyChange = value => {
    setGeoapifyInputValue(value);
    if (value && !geoapifyInputValue) {
      setErrorGeoapify("Nessun risultato trovato.");
    } else {
      setErrorGeoapify("");
    }
  };

  // FETCH
  const uploadProfilePic = avatarFile => {
    const formData = new FormData();
    formData.append("avatar", avatarFile);
    fetch(`${ENV_VARIABLE.URL_USERS}/me/avatar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      },
      body: formData
    })
      .then(response => {
        if (response.ok) {
          response.json();
          dispatch(getProfileAction());
        } else {
          throw new Error("Could not send data - @uploadProfilePic");
        }
      })
      .catch(error => console.log(error));
  };

  const editName = name => {
    fetch(`${ENV_VARIABLE.URL_RESTAURANTS}/my-restaurant/edit-name`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-type": "application/json"
      },
      body: JSON.stringify(name)
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Unable to update the restaurant name. Please try again later.");
        }
      })
      .then(() => {
        setName({
          name: ""
        });
        dispatch(getProfileAction());
        navigate(0);
      })
      .catch(error => console.log(error));
  };

  const editFullName = fullName => {
    fetch(editFullNameUrl, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-type": "application/json"
      },
      body: JSON.stringify({ name: fullName.name, surname: fullName.surname })
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Unable to update user's full name. Please try again later.");
        }
      })
      .then(() => {
        dispatch(getProfileAction());
        setFullName({
          name: "",
          surname: ""
        });
        navigate(0);
      })
      .catch(error => console.log(error));
  };

  const editEmail = email => {
    fetch(`${ENV_VARIABLE.URL_RESTAURANTS}/my-restaurant/edit-email`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-type": "application/json"
      },
      body: JSON.stringify(email)
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Unable to update the restaurant email. Please try again later.");
        }
      })
      .then(() => {
        setEmail({
          email: ""
        });
        dispatch(getProfileAction());
        navigate(0);
      })
      .catch(error => console.log(error));
  };

  const editPassword = password => {
    fetch(`${ENV_VARIABLE.URL_RESTAURANTS}/my-restaurant/edit-password`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-type": "application/json"
      },
      body: JSON.stringify(password)
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Unable to update the restaurant password. Please try again later.");
        }
      })
      .then(() => {
        setPassword({
          currentPassword: "",
          newPassword: ""
        });
        dispatch(getProfileAction());
        navigate(0);
      })
      .catch(error => console.log(error));
  };

  const editPhoneNumber = phoneNumber => {
    fetch(`${ENV_VARIABLE.URL_RESTAURANTS}/my-restaurant/edit-phoneNumber`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-type": "application/json"
      },
      body: JSON.stringify(phoneNumber)
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Unable to update the restaurant phone number. Please try again later.");
        }
      })
      .then(() => {
        setPhoneNumber({
          phoneNumber: ""
        });
        dispatch(getProfileAction());
        navigate(0);
      })
      .catch(error => console.log(error));
  };

  const editAddress = address => {
    fetch(`${ENV_VARIABLE.URL_RESTAURANTS}/my-restaurant/edit-address`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-type": "application/json"
      },
      body: JSON.stringify(address)
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Unable to update the restaurant address. Please try again later.");
        }
      })
      .then(() => {
        setAddress({
          address: "",
          city: "",
          latitude: null,
          longitude: null
        });
        dispatch(getProfileAction());
        navigate(0);
      })
      .catch(error => console.log(error));
  };

  // USE EFFECT
  useEffect(() => {
    dispatch(getProfileAction());
    if (profile) {
      const url = profile.userRole.userRole === "RIDER" ? `${ENV_VARIABLE.URL_RIDERS}/me/edit-name+surname` : `${ENV_VARIABLE.URL_USERS}/me/edit-name+surname`;
      setEditFullNameUrl(url);
    }
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setName({ name: profile.name });
      setFullName({ name: profile.name, surname: profile.surname });
      setEmail({ email: profile.email });
      setPhoneNumber({ phoneNumber: profile.phoneNumber });
    }
  }, [profile]);

  return (
    <>
      <NavComponent />
      {profile && (
        <Container className="my-5" style={{ paddingTop: "60px" }}>
          <h2>Account</h2>

          {/* CHANGE PROFILE PIC */}
          <div className="d-flex flex-column align-items-center">
            <img src={profile.avatarUrl} alt="" style={{ width: "85px" }} className="rounded-circle mb-2" />
            <Button variant="link" className="text-decoration-none edit__button__link" onClick={() => handleShow("profilePic")}>
              Change profile picture
            </Button>
            <Modal show={showProfilePic} onHide={() => handleClose("profilePic")} className="perfect-shadow">
              <Modal.Header closeButton className="border-bottom-0"></Modal.Header>
              <Modal.Body>
                <h2 className="fs-5 text-center">Update your profile picture</h2>
                <Form
                  className="mt-3"
                  onSubmit={event => {
                    event.preventDefault();
                    uploadProfilePic(img);
                  }}
                >
                  <InputGroup className="mb-3">
                    <FormControl type="file" accept="img/*" onChange={handleChangePic} className="my-3" />
                  </InputGroup>
                </Form>
              </Modal.Body>
              <Modal.Footer className="border-top-0 d-flex justify-content-center">
                <Button
                  onClick={() => {
                    uploadProfilePic(img);
                    handleClose("profilePic");
                  }}
                  className="rounded-pill px-5 border-0"
                  style={{ backgroundColor: "#F86834" }}
                >
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
          </div>

          {profile.userRole.userRole == "RESTAURANT" && (
            // CHANGE NAME
            <Row className="my-4">
              <Col md={11} className="d-flex align-items-center">
                <span className="me-3">
                  <img src="https://glovo.dhmedia.io/image/customer-assets-glovo/customer_profile/uds/person.svg?t=W3sic3ZnIjp7InEiOiJsb3cifX1d" alt="" style={{ width: "20px" }} />
                </span>
                <small>
                  {profile.name} {profile.surname}
                </small>
              </Col>
              <Col md={1}>
                <Button variant="link" className="text-decoration-none edit__button__link" onClick={() => handleShow("name")}>
                  Edit
                </Button>
              </Col>
              <Modal show={showName} onHide={() => handleClose("name")} className="perfect-shadow">
                <Modal.Header closeButton className="border-bottom-0"></Modal.Header>
                <Modal.Body>
                  <h2 className="fs-5 text-center">Your information</h2>
                  <Form
                    onSubmit={event => {
                      event.preventDefault();
                      editName(name);
                    }}
                  >
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control type="text" placeholder="Enter your name" value={name.name} name="name" onChange={event => handleChange("name", event)} />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer className="border-top-0 d-flex justify-content-center">
                  <Button
                    onClick={() => {
                      editName(name);
                      handleClose("name");
                    }}
                    className="rounded-pill px-5 border-0"
                    style={{ backgroundColor: "#F86834" }}
                  >
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Modal>
            </Row>
          )}

          {profile.userRole.userRole != "RESTAURANT" && (
            // CHANGE NAME + SURNAME
            <Row className="my-4">
              <Col md={11} className="d-flex align-items-center">
                <span className="me-3">
                  <img src="https://glovo.dhmedia.io/image/customer-assets-glovo/customer_profile/uds/person.svg?t=W3sic3ZnIjp7InEiOiJsb3cifX1d" alt="" style={{ width: "20px" }} />
                </span>
                <small>
                  {profile.name} {profile.surname}
                </small>
              </Col>
              <Col md={1}>
                <Button variant="link" className="text-decoration-none edit__button__link" onClick={() => handleShow("fullName")}>
                  Edit
                </Button>
              </Col>
              <Modal show={showFullName} onHide={() => handleClose("fullName")} className="perfect-shadow">
                <Modal.Header closeButton className="border-bottom-0"></Modal.Header>
                <Modal.Body>
                  <h2 className="fs-5 text-center">Your information</h2>
                  <Form
                    onSubmit={event => {
                      event.preventDefault();
                      editFullName(fullName);
                    }}
                  >
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control type="text" placeholder="Enter your name" value={fullName.name} name="name" onChange={event => handleChange("fullName", event)} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Surname</Form.Label>
                      <Form.Control type="text" placeholder="Enter your surnname" value={fullName.surname} name="surname" onChange={event => handleChange("fullName", event)} />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer className="border-top-0 d-flex justify-content-center">
                  <Button
                    onClick={() => {
                      editFullName(fullName);
                      handleClose("fullName");
                    }}
                    className="rounded-pill px-5 border-0"
                    style={{ backgroundColor: "#F86834" }}
                  >
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Modal>
            </Row>
          )}

          {/* CHANGE EMAIL */}
          <Row className="my-4">
            <Col md={11} className="d-flex align-items-center">
              <span className="me-3">
                <img src="https://glovo.dhmedia.io/image/customer-assets-glovo/customer_profile/mail.svg?t=W3sic3ZnIjp7InEiOiJsb3cifX1d" alt="" style={{ width: "20px" }} />
              </span>
              <small>{profile.email}</small>
            </Col>
            <Col md={1}>
              <Button variant="link" className="text-decoration-none edit__button__link" onClick={() => handleShow("email")}>
                Edit
              </Button>
            </Col>
            <Modal show={showEmail} onHide={() => handleClose("email")} className="perfect-shadow">
              <Modal.Header closeButton className="border-bottom-0"></Modal.Header>
              <Modal.Body>
                <h2 className="fs-5 text-center">Your email</h2>
                <Form
                  onSubmit={event => {
                    event.preventDefault();
                    editEmail(email);
                  }}
                >
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter your email" value={email.email} name="email" onChange={event => handleChange("email", event)} />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer className="border-top-0 d-flex justify-content-center">
                <Button onClick={() => handleClose("email")} className="rounded-pill px-5 border-0" style={{ backgroundColor: "#F86834" }}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
          </Row>

          {/* CHANGE ADDRESS */}
          <Row className="my-4">
            <Col md={11} className="d-flex align-items-center">
              <span className="me-3">
                <Geo />
              </span>
              <small>{profile.address.split(", ").slice(0, 3).join(", ")}</small>
            </Col>
            <Col md={1}>
              <Button variant="link" className="text-decoration-none edit__button__link" onClick={() => handleShow("address")}>
                Edit
              </Button>
            </Col>
            <Modal show={showAddress} onHide={() => handleClose("address")} className="perfect-shadow">
              <Modal.Header closeButton className="border-bottom-0"></Modal.Header>
              <Modal.Body>
                <h2 className="fs-5 text-center">Type your new address</h2>
                <Form
                  onSubmit={event => {
                    event.preventDefault();
                    editAddress(address);
                  }}
                >
                  <Form.Group className="signup__form__group mb-3 geoapify-input">
                    <Form.Label className="signup__form__group__label">Address</Form.Label>
                    <GeoapifyContext className="custom-input" apiKey={ENV_VARIABLE.GEOAPIFY_KEY}>
                      <GeoapifyGeocoderAutocomplete
                        placeSelect={handlePlaceSelect}
                        onError={handleGeoapifyError}
                        onChange={handleGeoapifyChange}
                        debounceDelay={800}
                        style={{ width: "100%" }}
                        required
                        options={{
                          filterByCountryCode: ["IT"]
                        }}
                      />
                    </GeoapifyContext>
                    {errorGeoapify != "" && <small className="text-danger">{errorGeoapify}</small>}
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer className="border-top-0 d-flex justify-content-center">
                <Button
                  onClick={() => {
                    editAddress(address);
                    handleClose("address");
                  }}
                  className="rounded-pill px-5 border-0"
                  style={{ backgroundColor: "#F86834" }}
                >
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
          </Row>

          {/* CHANGE PASSWORD */}
          <Row className="my-4">
            <Col md={11} className="d-flex align-items-center">
              <span className="me-3">
                <img src="https://glovo.dhmedia.io/image/customer-assets-glovo/customer_profile/lock.svg?t=W3sic3ZnIjp7InEiOiJsb3cifX1d" alt="" style={{ width: "20px" }} />
              </span>
              <small>Change password</small>
            </Col>
            <Col md={1}>
              <Button variant="link" className="text-decoration-none edit__button__link" onClick={() => handleShow("password")}>
                Edit
              </Button>
            </Col>
            <Modal show={showPassword} onHide={() => handleClose("password")} className="perfect-shadow">
              <Modal.Header closeButton className="border-bottom-0"></Modal.Header>
              <Modal.Body>
                <h2 className="fs-5 text-center">Change password</h2>
                <Form
                  onSubmit={event => {
                    event.preventDefault();
                    editPassword(password);
                  }}
                >
                  <Form.Group className="mb-3">
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter current password" value={password.currentPassword} name="currentPassword" onChange={event => handleChange("password", event)} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter new password" value={password.newPassword} name="newPassword" onChange={event => handleChange("password", event)} />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer className="border-top-0 d-flex justify-content-center">
                <Button
                  onClick={() => {
                    editPassword(password);
                    handleClose("password");
                  }}
                  className="rounded-pill px-5 border-0"
                  style={{ backgroundColor: "#F86834" }}
                >
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
          </Row>

          {/* CHANGE PHONE NUMBER */}
          <Row className="my-4">
            <Col md={11} className="d-flex align-items-center">
              <span className="me-3">
                <img src="https://glovo.dhmedia.io/image/customer-assets-glovo/customer_profile/screen.svg?t=W3sic3ZnIjp7InEiOiJsb3cifX1d" alt="" style={{ width: "20px" }} />
              </span>
              <small>Change phone number</small>
            </Col>
            <Col md={1}>
              <Button variant="link" className="text-decoration-none edit__button__link" onClick={() => handleShow("phoneNumber")}>
                Edit
              </Button>
            </Col>
            <Modal show={showPhoneNumber} onHide={() => handleClose("phoneNumber")} className="perfect-shadow">
              <Modal.Header closeButton className="border-bottom-0"></Modal.Header>
              <Modal.Body>
                <h2 className="fs-5 text-center">Change phone number</h2>
                <Form
                  onSubmit={event => {
                    event.preventDefault();
                    editPhoneNumber(phoneNumber);
                  }}
                >
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control type="tel" placeholder="Enter your phone number" value={phoneNumber.phoneNumber} name="phoneNumber" onChange={event => handleChange("phoneNumber", event)} />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer className="border-top-0 d-flex justify-content-center">
                <Button
                  onClick={() => {
                    editPhoneNumber(phoneNumber);
                    handleClose("phoneNumber");
                  }}
                  className="rounded-pill px-5 border-0"
                  style={{ backgroundColor: "#F86834" }}
                >
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
          </Row>
        </Container>
      )}
    </>
  );
};

export default ProfileComponent;
