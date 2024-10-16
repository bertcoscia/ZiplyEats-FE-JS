import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "animate.css";
import NavComponent from "../../navbar/NavComponent";

const RestaurantDashboardComponent = () => {
  return (
    <>
      <NavComponent />

      <Container className="mt-5 dashboard d-flex flex-column flex-lg-row justify-content-around" style={{ paddingTop: "140px" }}>
        <Link as={Button} to={"/past-orders"} className="dashboard__element text-decoration-none border rounded-4 pt-4 pb-1 px-5 text-decoration-none position-relative align-self-center" style={{ overflow: "visible" }}>
          <img
            className="dashboard__element__illustration position-absolute top-0 start-50 translate-middle"
            src="https://res.cloudinary.com/bertcoscia/image/upload/fl_preserve_transparency/v1728818213/Screenshot_2024-10-13_at_13.15.41-removebg-preview_npumvf.jpg?_s=public-apps"
            alt=""
            style={{ width: "160px", height: "160px" }}
          />
          <h2 className="dashboard__element__title fs-3 text-center mt-5 pt-4">Past orders</h2>
          <small className="dashboard__element__subtitle d-block text-center">See all your past orders</small>
        </Link>

        {/* <Link as={Button} className="dashboard__element text-decoration-none border rounded-4 pt-4 pb-1 px-5 text-decoration-none position-relative align-self-center" style={{ overflow: "visible" }}>
          <img
            className="dashboard__element__illustration position-absolute top-0 start-50 translate-middle"
            src="https://res.cloudinary.com/bertcoscia/image/upload/fl_preserve_transparency/v1728818706/Screenshot_2024-10-13_at_11.08.40-removebg-preview_qkiund.jpg?_s=public-apps"
            alt=""
            style={{ width: "160px", height: "160px" }}
          />
          <h2 className="dashboard__element__title fs-3 text-center mt-5 pt-4">New Orders</h2>
          <small className="dashboard__element__subtitle d-block text-center">See new orders you received</small>
        </Link> */}

        <Link as={Button} to={"/edit-menu"} className="dashboard__element text-decoration-none border rounded-4 pt-4 pb-1 px-5 text-decoration-none position-relative align-self-center" style={{ overflow: "visible" }}>
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
