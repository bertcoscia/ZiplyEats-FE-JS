import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Key } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import SingleRiderAvailableOrderComponent from "./SingleRiderAvailableOrderComponent";

const RiderAvailableOrdersComponent = () => {
  // ENV VARIABLES
  const ENV_VARIABLE = {
    URL_ORDERS: import.meta.env.VITE_ORDERS_URL
  };

  // USE STATE
  const [availableOrders, setAvailableOrders] = useState([]);

  // FETCH
  const getAvailableOrders = async () => {
    try {
      const response = await fetch(`${ENV_VARIABLE.URL_ORDERS}/rider/available-orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAvailableOrders(data.content);
      } else {
        throw new Error("Could not retrieve available orders.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // USE EFFECT
  useEffect(() => {
    getAvailableOrders();
  }, []);

  return (
    <Container className="my-5">
      {availableOrders.length > 0 ? (
        <>
          <h4 className="text-center">Available orders</h4>
          <div className="d-flex flex-wrap gap-3">
            {availableOrders.map(order => (
              <SingleRiderAvailableOrderComponent key={order.idOrder} order={order} />
            ))}
          </div>
        </>
      ) : (
        <h4 className="text-center mt-5">There are no available orders</h4>
      )}
    </Container>
  );
};

export default RiderAvailableOrdersComponent;
