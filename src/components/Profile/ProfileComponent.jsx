import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfileAction } from "../../redux/actions";
import { Button, Col, Container, Form, FormControl, InputGroup, Modal, Row } from "react-bootstrap";
import NavComponent from "../navbar/NavComponent";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const ProfileComponent = () => {
  const RESTAURANTS_URL = import.meta.env.VITE_RESTAURANTS_URL;
  const USERS_URL = import.meta.env.VITE_USERS_URL;
  const RIDERS_URL = import.meta.env.VITE_RIDERS_URL;
  const profile = useSelector(state => state.profile.content);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showName, setShowName] = useState(false);
  const [showFullName, setShowFullName] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [showProfilePic, setShowProfilePic] = useState(false);
  const [img, setImg] = useState(null);

  const handleChangePic = event => {
    setImg(event.target.files[0]);
  };

  const uploadProfilePic = avatarFile => {
    const formData = new FormData();
    formData.append("avatar", avatarFile);
    fetch(`${USERS_URL}/me/avatar`, {
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
          throw new Error("Coulnd't send data - @uploadProfilePic");
        }
      })
      .catch(error => console.log(error));
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
      default:
        break;
    }
  };

  const [name, setName] = useState({ name: "" });
  const [fullName, setFullName] = useState({ name: "", surname: "" });
  const [email, setEmail] = useState({ email: "" });
  const [password, setPassword] = useState({ currentPassword: "", newPassword: "" });
  const [phoneNumber, setPhoneNumber] = useState({ phoneNumber: "" });
  const [editFullNameUrl, setEditFullNameUrl] = useState("");

  useEffect(() => {
    dispatch(getProfileAction());
    if (profile) {
      const url = profile.userRole.userRole === "RIDER" ? `${RIDERS_URL}/me/edit-name+surname` : `${USERS_URL}/me/edit-name+surname`;
      setEditFullNameUrl(url);
      console.log(editFullNameUrl);
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

  const editName = name => {
    fetch(`${RESTAURANTS_URL}/my-restaurant/edit-name`, {
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
    fetch(`${RESTAURANTS_URL}/my-restaurant/edit-email`, {
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
    fetch(`${RESTAURANTS_URL}/my-restaurant/edit-password`, {
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
    fetch(`${RESTAURANTS_URL}/my-restaurant/edit-phoneNumber`, {
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

  return (
    <>
      <NavComponent />
      {profile && (
        <Container className="my-5" style={{ paddingTop: "60px" }}>
          <h2>Account</h2>
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
                  <Button type="submit" variant="primary" className="rounded-pill px-3" onClick={() => handleClose("profilePic")}>
                    Save Changes
                  </Button>
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
          </div>
          {profile.userRole.userRole == "RESTAURANT" && (
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
          </Row>
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
          </Row>
          <Row className="my-4">
            <Col md={11} className="d-flex align-items-center">
              <span className="me-3">
                <img src="https://glovo.dhmedia.io/image/customer-assets-glovo/customer_profile/payment.svg?t=W3sic3ZnIjp7InEiOiJsb3cifX1d" alt="" style={{ width: "20px" }} />
              </span>
              <small>Payment methods</small>
            </Col>
            <Col md={1}>
              <Button variant="link" className="text-decoration-none edit__button__link">
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
          <Row className="my-4">
            <Col md={11} className="d-flex align-items-center">
              <span className="me-3">
                <img src="https://glovo.dhmedia.io/image/customer-assets-glovo/customer_profile/invoice.svg?t=W3sic3ZnIjp7InEiOiJsb3cifX1d" alt="" style={{ width: "20px" }} />
              </span>
              <small>Invoice information</small>
            </Col>
            <Col md={1}>
              <Button variant="link" className="text-decoration-none edit__button__link">
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
