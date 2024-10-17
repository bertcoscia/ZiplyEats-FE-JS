import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import SingleActiveOrderComponent from "./SingleActiveOrderComponent";

const RestaurantActiveOrdersComponent = () => {
  // ENV VARIABLES
  const ENV_VARIABLE = {
    URL_ORDERS: import.meta.env.VITE_ORDERS_URL
  };

  // HOOKS
  const [activeOrders, setActiveOrders] = useState([]);

  // USE STATE

  // HANDLERS

  // FETCH
  const getActiveOrders = async () => {
    try {
      const response = await fetch(`${ENV_VARIABLE.URL_ORDERS}/my-orders/restaurant/active`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
      if (response.ok) {
        setActiveOrders(await response.json());
      } else {
        throw new Error("Could not retrieve active orders. Please try again - @getActiveOrders");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // UTILS

  // USE EFFECT
  useEffect(() => {
    getActiveOrders();
  }, []);

  return (
    <Container className="my-3">
      <h2 className="text-center">Active orders</h2>
      <div className="d-flex flex-wrap">{activeOrders.length > 0 ? activeOrders.map(order => <SingleActiveOrderComponent key={order.idOrder} order={order} />) : <p className="text-center">There are no active orders</p>}</div>
    </Container>
  );
};

export default RestaurantActiveOrdersComponent;
