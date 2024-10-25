import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfileAction } from "../../redux/actions";
import { Button, Col, Container, Form, FormControl, InputGroup, Modal, Row } from "react-bootstrap";
import NavComponent from "../NavComponent/NavComponent";
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
  const [userRole, setUserRole] = useState("");

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
    switch (userRole) {
      case "RESTAURANT":
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
        break;
      case "RIDER":
        fetch(`${ENV_VARIABLE.URL_RIDERS}/me/edit-email`, {
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
        break;
      case "USER":
        fetch(`${ENV_VARIABLE.URL_USERS}/me/edit-email`, {
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
        break;
      default:
        break;
    }
  };

  const editPassword = password => {
    switch (userRole) {
      case "RESTAURANT":
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
        break;
      case "RIDER":
        fetch(`${ENV_VARIABLE.URL_RIDERS}/me/edit-password`, {
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
        break;
      case "USER":
        fetch(`${ENV_VARIABLE.URL_USERS}/me/edit-password`, {
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
        break;
      default:
        break;
    }
  };

  const editPhoneNumber = phoneNumber => {
    switch (userRole) {
      case "RESTAURANT":
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
        break;
      case "RIDER":
        fetch(`${ENV_VARIABLE.URL_RIDERS}/me/edit-phoneNumber`, {
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
        break;
      case "USER":
        fetch(`${ENV_VARIABLE.URL_USERS}/me/edit-phoneNumber`, {
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
        break;
      default:
        break;
    }
  };

  const editAddress = address => {
    switch (userRole) {
      case "RESTAURANT":
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
        break;
      case "RIDER":
        fetch(`${ENV_VARIABLE.URL_RIDERS}/me/edit-address`, {
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
        break;
      case "USER":
        fetch(`${ENV_VARIABLE.URL_USERS}/me/edit-address`, {
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
        break;
      default:
        break;
    }
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
      setUserRole(profile.userRole.userRole);
    }
  }, [profile]);

  return (
    <>
      <NavComponent />
      {profile && (
        <Container className="profile__container my-5" style={{ paddingTop: "60px" }}>
          <h2 className="profile__title">Account</h2>

          {/* CHANGE PROFILE PIC */}
          <div className="profile__change-pic d-flex flex-column align-items-center">
            <img src={profile.avatarUrl} alt="" className="profile__avatar rounded-circle mb-2" style={{ width: "85px" }} />
            <Button variant="link" className="profile__edit-button text-decoration-none" onClick={() => handleShow("profilePic")}>
              Change profile picture
            </Button>
            <Modal show={showProfilePic} onHide={() => handleClose("profilePic")} className="profile__modal perfect-shadow">
              <Modal.Header closeButton className="profile__modal-header border-bottom-0"></Modal.Header>
              <Modal.Body className="profile__modal-body">
                <h2 className="profile__modal-title fs-5 text-center">Update your profile picture</h2>
                <Form
                  className="profile__form mt-3"
                  onSubmit={event => {
                    event.preventDefault();
                    uploadProfilePic(img);
                  }}
                >
                  <InputGroup className="profile__input-group mb-3">
                    <FormControl type="file" accept="img/*" onChange={handleChangePic} className="my-3 profile__file-input" />
                  </InputGroup>
                </Form>
              </Modal.Body>
              <Modal.Footer className="profile__modal-footer border-top-0 d-flex justify-content-center">
                <Button
                  onClick={() => {
                    uploadProfilePic(img);
                    handleClose("profilePic");
                  }}
                  className="profile__save-button rounded-pill px-3 border-0"
                  variant="accent"
                >
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
          </div>

          {profile.userRole.userRole === "RESTAURANT" && (
            // CHANGE NAME
            <Row className="profile__name-change my-4">
              <Col md={11} className="profile__name-info d-flex align-items-center">
                <span className="me-3">
                  <img src="https://glovo.dhmedia.io/image/customer-assets-glovo/customer_profile/uds/person.svg?t=W3sic3ZnIjp7InEiOiJsb3cifX1d" alt="" className="profile__icon" style={{ width: "20px" }} />
                </span>
                <small className="profile__name-text">
                  {profile.name} {profile.surname}
                </small>
              </Col>
              <Col md={1}>
                <Button variant="link" className="profile__edit-button text-decoration-none" onClick={() => handleShow("name")}>
                  Edit
                </Button>
              </Col>
              <Modal show={showName} onHide={() => handleClose("name")} className="profile__modal perfect-shadow">
                <Modal.Header closeButton className="profile__modal-header border-bottom-0"></Modal.Header>
                <Modal.Body className="profile__modal-body">
                  <h2 className="profile__modal-title fs-5 text-center">Your information</h2>
                  <Form
                    onSubmit={event => {
                      event.preventDefault();
                      editName(name);
                    }}
                  >
                    <Form.Group className="mb-3 profile__form-group">
                      <Form.Label className="profile__form-label">Name</Form.Label>
                      <Form.Control type="text" placeholder="Enter your name" value={name.name} name="name" onChange={event => handleChange("name", event)} className="profile__form-control" />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer className="profile__modal-footer border-top-0 d-flex justify-content-center">
                  <Button
                    onClick={() => {
                      editName(name);
                      handleClose("name");
                    }}
                    className="profile__save-button rounded-pill px-3 border-0"
                    variant="accent"
                  >
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Modal>
            </Row>
          )}

          {profile.userRole.userRole !== "RESTAURANT" && (
            // CHANGE NAME + SURNAME
            <Row className="profile__full-name-change my-4">
              <Col md={11} className="profile__full-name-info d-flex align-items-center">
                <span className="me-3">
                  <img src="https://glovo.dhmedia.io/image/customer-assets-glovo/customer_profile/uds/person.svg?t=W3sic3ZnIjp7InEiOiJsb3cifX1d" alt="" className="profile__icon" style={{ width: "20px" }} />
                </span>
                <small className="profile__full-name-text">
                  {profile.name} {profile.surname}
                </small>
              </Col>
              <Col md={1}>
                <Button variant="link" className="profile__edit-button text-decoration-none" onClick={() => handleShow("fullName")}>
                  Edit
                </Button>
              </Col>
              <Modal show={showFullName} onHide={() => handleClose("fullName")} className="profile__modal perfect-shadow">
                <Modal.Header closeButton className="profile__modal-header border-bottom-0"></Modal.Header>
                <Modal.Body className="profile__modal-body">
                  <h2 className="profile__modal-title fs-5 text-center">Your information</h2>
                  <Form
                    onSubmit={event => {
                      event.preventDefault();
                      editFullName(fullName);
                    }}
                  >
                    <Form.Group className="mb-3 profile__form-group">
                      <Form.Label className="profile__form-label">Name</Form.Label>
                      <Form.Control type="text" placeholder="Enter your name" value={fullName.name} name="name" onChange={event => handleChange("fullName", event)} className="profile__form-control" />
                    </Form.Group>
                    <Form.Group className="mb-3 profile__form-group">
                      <Form.Label className="profile__form-label">Surname</Form.Label>
                      <Form.Control type="text" placeholder="Enter your surname" value={fullName.surname} name="surname" onChange={event => handleChange("fullName", event)} className="profile__form-control" />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer className="profile__modal-footer border-top-0 d-flex justify-content-center">
                  <Button
                    onClick={() => {
                      editFullName(fullName);
                      handleClose("fullName");
                    }}
                    className="profile__save-button rounded-pill px-3 border-0"
                    variant="accent"
                  >
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Modal>
            </Row>
          )}

          {/* CHANGE EMAIL */}
          <Row className="profile__email-change my-4">
            <Col md={11} className="profile__email-info d-flex align-items-center">
              <span className="me-3">
                <img src="https://glovo.dhmedia.io/image/customer-assets-glovo/customer_profile/mail.svg?t=W3sic3ZnIjp7InEiOiJsb3cifX1d" alt="" className="profile__icon" style={{ width: "20px" }} />
              </span>
              <small className="profile__email-text">{profile.email}</small>
            </Col>
            <Col md={1}>
              <Button variant="link" className="profile__edit-button text-decoration-none" onClick={() => handleShow("email")}>
                Edit
              </Button>
            </Col>
            <Modal show={showEmail} onHide={() => handleClose("email")} className="profile__modal perfect-shadow">
              <Modal.Header closeButton className="profile__modal-header border-bottom-0"></Modal.Header>
              <Modal.Body className="profile__modal-body">
                <h2 className="profile__modal-title fs-5 text-center">Your email</h2>
                <Form
                  onSubmit={event => {
                    event.preventDefault();
                    editEmail(email);
                  }}
                >
                  <Form.Group className="mb-3 profile__form-group">
                    <Form.Label className="profile__form-label">Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter your email" value={email.email} name="email" onChange={event => handleChange("email", event)} className="profile__form-control" />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer className="profile__modal-footer border-top-0 d-flex justify-content-center">
                <Button
                  onClick={() => {
                    editEmail(email);
                    handleClose("email");
                  }}
                  className="profile__save-button rounded-pill px-3 border-0"
                  variant="accent"
                >
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
          </Row>

          {/* CHANGE ADDRESS */}
          <Row className="profile__address-change my-4">
            <Col md={11} className="profile__address-info d-flex align-items-center">
              <span className="me-3 profile__icon">
                <Geo />
              </span>
              <small className="profile__address-text">{profile.address.split(", ").slice(0, 3).join(", ")}</small>
            </Col>
            <Col md={1}>
              <Button variant="link" className="profile__edit-button text-decoration-none" onClick={() => handleShow("address")}>
                Edit
              </Button>
            </Col>
            <Modal show={showAddress} onHide={() => handleClose("address")} className="profile__modal perfect-shadow">
              <Modal.Header closeButton className="profile__modal-header border-bottom-0"></Modal.Header>
              <Modal.Body className="profile__modal-body">
                <h2 className="profile__modal-title fs-5 text-center">Type your new address</h2>
                <Form
                  onSubmit={event => {
                    event.preventDefault();
                    editAddress(address);
                  }}
                >
                  <Form.Group className="profile__form-group mb-3 geoapify-input">
                    <Form.Label className="profile__form-label">Address</Form.Label>
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
                        className="profile__geoapify-input"
                      />
                    </GeoapifyContext>
                    {errorGeoapify !== "" && <small className="text-danger profile__error-message">{errorGeoapify}</small>}
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer className="profile__modal-footer border-top-0 d-flex justify-content-center">
                <Button
                  onClick={() => {
                    editAddress(address);
                    handleClose("address");
                  }}
                  className="profile__save-button rounded-pill px-3 border-0"
                  variant="accent"
                >
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
          </Row>

          {/* CHANGE PASSWORD */}
          <Row className="profile__password-change my-4">
            <Col md={11} className="profile__password-info d-flex align-items-center">
              <span className="me-3 profile__icon">
                <img src="https://glovo.dhmedia.io/image/customer-assets-glovo/customer_profile/lock.svg?t=W3sic3ZnIjp7InEiOiJsb3cifX1d" alt="" style={{ width: "20px" }} />
              </span>
              <small className="profile__password-text">Change password</small>
            </Col>
            <Col md={1}>
              <Button variant="link" className="profile__edit-button text-decoration-none" onClick={() => handleShow("password")}>
                Edit
              </Button>
            </Col>
            <Modal show={showPassword} onHide={() => handleClose("password")} className="profile__modal perfect-shadow">
              <Modal.Header closeButton className="profile__modal-header border-bottom-0"></Modal.Header>
              <Modal.Body className="profile__modal-body">
                <h2 className="profile__modal-title fs-5 text-center">Change password</h2>
                <Form
                  onSubmit={event => {
                    event.preventDefault();
                    editPassword(password);
                  }}
                >
                  <Form.Group className="profile__form-group mb-3">
                    <Form.Label className="profile__form-label">Current Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter current password" value={password.currentPassword} name="currentPassword" onChange={event => handleChange("password", event)} className="profile__input" />
                  </Form.Group>
                  <Form.Group className="profile__form-group mb-3">
                    <Form.Label className="profile__form-label">New Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter new password" value={password.newPassword} name="newPassword" onChange={event => handleChange("password", event)} className="profile__input" />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer className="profile__modal-footer border-top-0 d-flex justify-content-center">
                <Button
                  onClick={() => {
                    editPassword(password);
                    handleClose("password");
                  }}
                  className="profile__save-button rounded-pill px-3 border-0"
                  variant="accent"
                >
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
          </Row>

          {/* CHANGE PHONE NUMBER */}
          <Row className="profile__phone-change my-4">
            <Col md={11} className="profile__phone-info d-flex align-items-center">
              <span className="me-3 profile__icon">
                <img src="https://glovo.dhmedia.io/image/customer-assets-glovo/customer_profile/screen.svg?t=W3sic3ZnIjp7InEiOiJsb3cifX1d" alt="" style={{ width: "20px" }} />
              </span>
              <small className="profile__phone-text">Change phone number</small>
            </Col>
            <Col md={1}>
              <Button variant="link" className="profile__edit-button text-decoration-none" onClick={() => handleShow("phoneNumber")}>
                Edit
              </Button>
            </Col>
            <Modal show={showPhoneNumber} onHide={() => handleClose("phoneNumber")} className="profile__modal perfect-shadow">
              <Modal.Header closeButton className="profile__modal-header border-bottom-0"></Modal.Header>
              <Modal.Body className="profile__modal-body">
                <h2 className="profile__modal-title fs-5 text-center">Change phone number</h2>
                <Form
                  onSubmit={event => {
                    event.preventDefault();
                    editPhoneNumber(phoneNumber);
                  }}
                >
                  <Form.Group className="profile__form-group mb-3">
                    <Form.Label className="profile__form-label">Phone Number</Form.Label>
                    <Form.Control type="tel" placeholder="Enter your phone number" value={phoneNumber.phoneNumber} name="phoneNumber" onChange={event => handleChange("phoneNumber", event)} className="profile__input" />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer className="profile__modal-footer border-top-0 d-flex justify-content-center">
                <Button
                  onClick={() => {
                    editPhoneNumber(phoneNumber);
                    handleClose("phoneNumber");
                  }}
                  className="profile__save-button rounded-pill px-3 border-0"
                  variant="accent"
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
