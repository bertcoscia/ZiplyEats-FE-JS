import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AvailableOrdersComponent = () => {
  // ENV VARIABLES
  const ENV_VARIABLE = {
    URL_ORDERS: import.meta.env.VITE_ORDERS_URL
  };

  // HOOKS
  const navigate = useNavigate();

  // USE STATE
  const [availableOrders, setAvailableOrders] = useState([]);

  // HANDLERS

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

  const riderAcceptsOrder = async idOrder => {
    try {
      const response = await fetch(`${ENV_VARIABLE.URL_ORDERS}/${idOrder}/assign-rider`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
      if (response.ok) {
        await response.json();
        navigate(0);
      } else {
        throw new Error("Could not accept order. Please try again");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // UTILS
  const formatDateTime = dateTimeString => {
    const date = new Date(dateTimeString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-4);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  function formatAddress(fullAddress) {
    const addressParts = fullAddress.split(",");
    const street = addressParts[0].trim();
    const streetNumber = addressParts[1].trim();
    const postalCode = addressParts[2].trim().slice(0, 6);
    return `${street}, ${streetNumber}, ${postalCode}`;
  }

  // USE EFFECT
  useEffect(() => {
    getAvailableOrders();
  }, []);

  return (
    <>
      {availableOrders.length > 0 ? (
        <>
          <h4 className="text-center">Available orders</h4>
          {availableOrders.map(order => (
            <Row key={order.idOrder} className="card d-flex flex-row align-items-center perfect-shadow p-3 mx-auto">
              <Col md={3} className="fw-bold">
                Restaurant
              </Col>
              <Col md={3} className="fw-bold">
                Restaurant&apos;s address
              </Col>
              <Col md={3} className="fw-bold">
                Delivery address
              </Col>
              <Col md={3} className="fw-bold">
                Requested delivery time
              </Col>
              <Col md={3} className="small">
                {order.restaurant.name}
              </Col>
              <Col md={3} className="small">
                {formatAddress(order.restaurant.address)}
              </Col>
              <Col md={3} className="small">
                {formatAddress(order.deliveryAddress)}
              </Col>
              <Col md={3} className="small">
                {formatDateTime(order.requestedDeliveryDateTime)}
              </Col>
              <Col xs={12} className="mt-3 d-flex justify-content-center">
                <Button variant="primary" onClick={() => riderAcceptsOrder(order.idOrder)}>
                  Accept order
                </Button>
              </Col>
            </Row>
          ))}
        </>
      ) : (
        <h4 className="text-center mt-5">There no available orders</h4>
      )}
    </>
  );
};

export default AvailableOrdersComponent;
