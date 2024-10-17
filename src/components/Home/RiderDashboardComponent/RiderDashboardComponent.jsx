import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import RiderActiveOrderComponent from "./RiderActiveOrderComponent";

const RiderDashboardComponent = ({ profile }) => {
  // ENV VARIABLES
  const ENV_VARIABLE = {
    URL_ORDERS: import.meta.env.VITE_ORDERS_URL
  };

  // HOOKS

  // USE STATE
  const [activeOrder, setActiveOrder] = useState(null);

  // HANDLERS

  // FETCH
  const getActiveOrder = async () => {
    try {
      const response = await fetch(`${ENV_VARIABLE.URL_ORDERS}/rider/active-order`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
      if (response.ok) {
        setActiveOrder(await response.json());
      } else {
        throw new Error("Could not find rider's current order - @getActiveOrder");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // UTILS

  // USE EFFECT
  useEffect(() => {
    getActiveOrder();
  }, []);

  return (
    <>
      <Container className="mt-5 dashboard d-flex flex-column flex-lg-row justify-content-around" style={{ paddingTop: "140px" }}>
        <Link to={"/past-orders"} className="dashboard__element text-decoration-none border rounded-4 pt-4 pb-1 px-5 text-decoration-none position-relative align-self-center mb-5 mb-lg-0" style={{ overflow: "visible" }}>
          <img
            className="dashboard__element__illustration position-absolute top-0 start-50 translate-middle"
            src="https://res.cloudinary.com/bertcoscia/image/upload/fl_preserve_transparency/v1728818213/Screenshot_2024-10-13_at_13.15.41-removebg-preview_npumvf.jpg?_s=public-apps"
            alt=""
            style={{ width: "160px", height: "160px" }}
          />
          <h2 className="dashboard__element__title fs-3 text-center mt-5 pt-4">Past orders</h2>
          <small className="dashboard__element__subtitle d-block text-center">See all your past orders</small>
        </Link>
      </Container>
      {activeOrder && <Container>{profile.busyWithOrder ? <RiderActiveOrderComponent order={activeOrder} /> : <p>not busy</p>}</Container>}
    </>
  );
};

export default RiderDashboardComponent;
