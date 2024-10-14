import { Container, Navbar, Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "./NavComponent.css";
import { useEffect } from "react";
import { getProfileAction } from "../../redux/actions";

const NavComponent = () => {
  const profile = useSelector(state => state.profile.content);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProfileAction());
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  return (
    <>
      {profile && (
        <Navbar className="d-flex align-items-center perfect-shadow" style={{ backgroundColor: "#F86834", height: "80px", zIndex: "99" }}>
          <Container className="d-flex justify-content-between">
            <Navbar.Brand as={Link} to={"/home"}>
              <img src="https://res.cloudinary.com/bertcoscia/image/upload/fl_preserve_transparency/v1728833203/ZiplyEats_-_Logo_bnbxwx.jpg?_s=public-apps" width={"150px"} className="d-inline-block align-top" alt="React Bootstrap logo" />
            </Navbar.Brand>

            <Dropdown>
              <Dropdown.Toggle className="text-decoration-none align-self-center bg-transparent border-0 rounded-circle">
                <img src={profile.avatarUrl} alt="" width={"44px"} className="rounded-circle" />
              </Dropdown.Toggle>

              <Dropdown.Menu className="rounded-4 profile__dropdown">
                <Dropdown.Item as={Link} to={"/me"}>
                  <span className="me-2">
                    <img src="https://glovo.dhmedia.io/image/customer-assets-glovo/customer_profile/uds/person.svg?t=W3sic3ZnIjp7InEiOiJsb3cifX1d" alt="" style={{ width: "15px" }} />
                  </span>
                  Profile
                </Dropdown.Item>
                <Dropdown.Item onClick={logout}>
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
