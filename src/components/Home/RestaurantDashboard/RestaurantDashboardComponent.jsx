import { Button, Container, Dropdown } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "animate.css";

const RestaurantDashboardComponent = () => {
  const profile = useSelector(state => state.profile.content);

  return (
    <>
      <Container className="profile position-relative my-5 pb-5 text-center d-flex flex-column align-items-center">
        <img src={profile.avatarUrl} alt="" className="profile__pic rounded-circle mb-2 align-self-center" style={{ width: "82px" }} />

        <Dropdown className="mb-3">
          <Dropdown.Toggle className="profile__button text-decoration-none border rounded-pill align-self-center px-4 py-1" id="dropdown-basic">
            {profile.name}
          </Dropdown.Toggle>

          <Dropdown.Menu className="rounded-4 profile__dropdown">
            <Dropdown.Item as={Link} to={"/me"}>
              <span className="me-2">
                <img src="https://glovo.dhmedia.io/image/customer-assets-glovo/customer_profile/uds/person.svg?t=W3sic3ZnIjp7InEiOiJsb3cifX1d" alt="" style={{ width: "15px" }} />
              </span>
              Profile
            </Dropdown.Item>
            <Dropdown.Item href="#/action-2">
              <span className="me-2">
                <img src="https://glovo.dhmedia.io/image/customer-assets-glovo/customer_profile/uds/exit.svg?t=W3sic3ZnIjp7InEiOiJsb3cifX1d" alt="" style={{ width: "15px" }} />
              </span>
              Log out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Container>

      <Container className="mt-5 dashboard d-flex flex-column flex-lg-row justify-content-between">
        <Link as={Button} className="dashboard__element text-decoration-none border rounded-4 pt-4 pb-1 px-5 text-decoration-none position-relative align-self-center" style={{ overflow: "visible" }}>
          <img
            className="dashboard__element__illustration position-absolute top-0 start-50 translate-middle"
            src="https://res.cloudinary.com/bertcoscia/image/upload/fl_preserve_transparency/v1728818213/Screenshot_2024-10-13_at_13.15.41-removebg-preview_npumvf.jpg?_s=public-apps"
            alt=""
            style={{ width: "160px", height: "160px" }}
          />
          <h2 className="dashboard__element__title fs-3 text-center mt-5 pt-4">Past orders</h2>
          <small className="dashboard__element__subtitle d-block text-center">See all your past orders</small>
        </Link>

        <Link as={Button} className="dashboard__element text-decoration-none border rounded-4 pt-4 pb-1 px-5 text-decoration-none position-relative align-self-center" style={{ overflow: "visible" }}>
          <img
            className="dashboard__element__illustration position-absolute top-0 start-50 translate-middle"
            src="https://res.cloudinary.com/bertcoscia/image/upload/fl_preserve_transparency/v1728818706/Screenshot_2024-10-13_at_11.08.40-removebg-preview_qkiund.jpg?_s=public-apps"
            alt=""
            style={{ width: "160px", height: "160px" }}
          />
          <h2 className="dashboard__element__title fs-3 text-center mt-5 pt-4">New Orders</h2>
          <small className="dashboard__element__subtitle d-block text-center">See new orders you received</small>
        </Link>

        <Link as={Button} className="dashboard__element text-decoration-none border rounded-4 pt-4 pb-1 px-5 text-decoration-none position-relative align-self-center" style={{ overflow: "visible" }}>
          <img
            className="dashboard__element__illustration position-absolute top-0 start-50 translate-middle"
            src="https://res.cloudinary.com/bertcoscia/image/upload/fl_preserve_transparency/v1728819194/Screenshot_2024-10-13_at_13.32.06-removebg-preview_fdqulp.jpg?_s=public-apps"
            alt=""
            style={{ width: "160px", height: "160px" }}
          />
          <h2 className="dashboard__element__title fs-3 text-center mt-5 pt-4">Edit your menu</h2>
          <small className="dashboard__element__subtitle d-block text-center">See and edit all your products</small>
        </Link>
      </Container>
    </>
  );
};

export default RestaurantDashboardComponent;
