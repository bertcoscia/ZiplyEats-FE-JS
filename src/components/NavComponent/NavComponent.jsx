import { Container, Navbar, Dropdown, Button, Modal, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "./NavComponent.css";
import { useEffect, useState } from "react";
import { getProfileAction } from "../../redux/actions";

const NavComponent = ({ scrollToJoinUs }) => {
  // ENV VARIABLES
  const ENV_VARIABLE = {
    URL_AUTH: import.meta.env.VITE_AUTH_URL
  };

  // HOOKS
  const profile = useSelector(state => state.profile.content);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // USE STATE
  const [showLogin, setShowLogin] = useState(false);
  const [loginDTO, setLoginDTO] = useState({
    email: "",
    password: ""
  });

  const [loginError, setLoginError] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));

  // HANDLERS
  const handleShowLogin = () => {
    setShowLogin(true);
  };

  const handleShowLoginClose = () => {
    setShowLogin(false);
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
        setAccessToken(LoginRespDTO.accessToken);
        setLoginDTO({
          email: "",
          password: ""
        });
        navigate("/home");
      })
      .catch(error => console.log(error));
  };

  // UTILS
  const logout = () => {
    localStorage.removeItem("accessToken");
    setAccessToken(null);
    navigate("/");
  };

  // USE EFFECT
  useEffect(() => {
    if (accessToken) {
      setIsLoggedIn(true);
      dispatch(getProfileAction());
    } else {
      setIsLoggedIn(false);
    }
  }, [accessToken, dispatch]);

  return (
    <>
      <Navbar className="navbar d-flex align-items-center perfect-shadow bg-background" style={{ height: "80px", zIndex: "99" }}>
        <Container className="navbar__brand d-flex justify-content-between">
          <Navbar.Brand as={Link} to={"/home"} className="navbar__brand__image">
            <img src="https://res.cloudinary.com/bertcoscia/image/upload/fl_preserve_transparency/v1729435276/Screenshot_2024-10-20_at_16.37.03_qxysln.jpg?_s=public-apps" width={"150px"} className="d-inline-block align-top" alt="" />
          </Navbar.Brand>

          {isLoggedIn ? (
            <Dropdown className="navbar__dropdown">
              <Dropdown.Toggle as={Button} variant="accent" className="navbar__dropdown__toggle align-self-center py-0 px-2 border-3 rounded-1">
                <small>Account</small>
              </Dropdown.Toggle>

              <Dropdown.Menu className="navbar__dropdown__menu bg-accent">
                <Dropdown.Item as={Link} to={"/me"} className="navbar__dropdown__menu__item">
                  <span className="me-2">
                    <img src="https://glovo.dhmedia.io/image/customer-assets-glovo/customer_profile/uds/person.svg?t=W3sic3ZnIjp7InEiOiJsb3cifX1d" alt="" style={{ width: "15px" }} />
                  </span>
                  Profile
                </Dropdown.Item>

                {profile.userRole.userRole === "USER" && (
                  <Dropdown.Item as={Link} to={"/me"} className="navbar__dropdown__menu__item">
                    <span className="me-2">
                      <img src="https://glovo.dhmedia.io/image/customer-assets-glovo/customer_profile/uds/bags.svg?t=W3sic3ZnIjp7InEiOiJsb3cifX1d" alt="" style={{ width: "15px" }} />
                    </span>
                    Orders
                  </Dropdown.Item>
                )}

                <Dropdown.Item onClick={logout} className="navbar__dropdown__menu__item">
                  <span className="me-2">
                    <img src="https://glovo.dhmedia.io/image/customer-assets-glovo/customer_profile/uds/exit.svg?t=W3sic3ZnIjp7InEiOiJsb3cifX1d" alt="" style={{ width: "15px" }} />
                  </span>
                  Log out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <div className="d-flex column-gap-3">
              <Button onClick={scrollToJoinUs} variant="accent" className="align-self-center py-0 px-2 border-3 rounded-1">
                <small>Sign up</small>
              </Button>
              <Button onClick={handleShowLogin} variant="accent" className="align-self-center py-0 px-2 border-3 rounded-1">
                <small>Login</small>
              </Button>
              <Modal show={showLogin} onHide={handleShowLoginClose} className="profile__modal perfect-shadow">
                <Modal.Header closeButton className="profile__modal-header border-bottom-0"></Modal.Header>
                <Modal.Body className="profile__modal-body">
                  <Form onSubmit={handleSubmit}>
                    <h2 className="text-center">Login</h2>
                    <Form.Group className="login__form__group my-3" controlId="formBasicEmail">
                      <Form.Label className="login__form__label">Email address</Form.Label>
                      <Form.Control type="email" placeholder="Enter email" name="email" value={loginDTO.email} onChange={handleTextChange} className="login__form__input" required />
                    </Form.Group>
                    <Form.Group className="login__form__group" controlId="formBasicPassword">
                      <Form.Label className="login__form__label">Password</Form.Label>
                      <Form.Control type="password" placeholder="Password" name="password" value={loginDTO.password} onChange={handleTextChange} className="login__form__input" required />
                    </Form.Group>
                    {loginError && <p className="text-danger">Wrong password and/or email</p>}
                  </Form>
                  <div className="d-flex justify-content-center mt-3">
                    <Button onClick={handleSubmit} className="profile__save-button rounded-pill px-3 border-0" variant="accent">
                      Login
                    </Button>
                  </div>
                </Modal.Body>
                <Modal.Footer className="profile__modal-footer border-top-0 mb-0 d-flex justify-content-center"></Modal.Footer>
              </Modal>
            </div>
          )}
        </Container>
      </Navbar>
    </>
  );
};

export default NavComponent;
