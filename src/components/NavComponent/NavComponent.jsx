import { Container, Navbar, Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "./NavComponent.css";
import { useEffect } from "react";
import { getProfileAction } from "../../redux/actions";

const NavComponent = () => {
  // HOOKS
  const profile = useSelector(state => state.profile.content);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // UTILS
  const logout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  // USE EFFECT
  useEffect(() => {
    dispatch(getProfileAction());
  }, []);

  return (
    <>
      {profile && (
        <Navbar className="navbar d-flex align-items-center perfect-shadow bg-primary" style={{ height: "80px", zIndex: "99" }}>
          <Container className="navbar__brand d-flex justify-content-between">
            <Navbar.Brand as={Link} to={"/home"} className="navbar__brand__image">
              <img src="https://res.cloudinary.com/bertcoscia/image/upload/fl_preserve_transparency/v1728833203/ZiplyEats_-_Logo_bnbxwx.jpg?_s=public-apps" width={"150px"} className="d-inline-block align-top" alt="React Bootstrap logo" />
            </Navbar.Brand>

            <Dropdown className="navbar__dropdown">
              <Dropdown.Toggle className="navbar__dropdown__toggle text-decoration-none align-self-center bg-transparent border-0 rounded-circle">
                <img src={profile.avatarUrl} alt="" width={"44px"} className="rounded-circle" />
              </Dropdown.Toggle>

              <Dropdown.Menu className="navbar__dropdown__menu rounded-4 bg-primary">
                <Dropdown.Item as={Link} to={"/me"} className="navbar__dropdown__menu__item">
                  <span className="me-2">
                    <img src="https://glovo.dhmedia.io/image/customer-assets-glovo/customer_profile/uds/person.svg?t=W3sic3ZnIjp7InEiOiJsb3cifX1d" alt="" style={{ width: "15px" }} />
                  </span>
                  Profile
                </Dropdown.Item>
                <Dropdown.Item onClick={logout} className="navbar__dropdown__menu__item">
                  <span className="me-2">
                    <img src="https://glovo.dhmedia.io/image/customer-assets-glovo/customer_profile/uds/exit.svg?t=W3sic3ZnIjp7InEiOiJsb3cifX1d" alt="" style={{ width: "15px" }} />
                  </span>
                  Log out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Container>
        </Navbar>
      )}
    </>
  );
};

export default NavComponent;
