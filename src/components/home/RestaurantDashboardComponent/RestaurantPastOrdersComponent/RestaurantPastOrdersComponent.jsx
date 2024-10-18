import { useEffect, useState } from "react";
import NavComponent from "../../../NavComponent/NavComponent";
import { Button, Container } from "react-bootstrap";
import SingleOrderComponent from "./SingleRestaurantPastOrderComponent";
import { Link, useNavigate } from "react-router-dom";

const RestaurantPastOrdersComponent = () => {
  // ENV VARIABLES
  const ENV_VARIABLE = {
    URL_ORDERS: import.meta.env.VITE_ORDERS_URL
  };

  // USE STATE
  const [restaurantPastOrders, setRestaurantPastOrders] = useState([]);

  // FETCH
  const getRestaurantPastOrders = () => {
    fetch(`${ENV_VARIABLE.URL_ORDERS}/my-orders/restaurant/past-orders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("There was an error while retrieving your past orders - @getRestaurantPastOrdersAction");
        }
      })
      .then(data => {
        setRestaurantPastOrders(data.content);
      })
      .catch(error => console.log(error));
  };

  // USE EFFECT
  useEffect(() => {
    getRestaurantPastOrders();
  }, []);

  return (
    <>
      <NavComponent />

      {restaurantPastOrders.length > 0 && (
        <>
          <Container style={{ marginTop: "110px" }}>
            <h1 className="text-center mb-3">Past Orders</h1>
            <Button as={Link} to={"/home"} variant="link" className="text-decoration-none mb-3">
              Go back
            </Button>
            <div className="d-flex flex-wrap">
              {restaurantPastOrders
                .sort((a, b) => new Date(b.creationDateTime) - new Date(a.creationDateTime))
                .map(order => (
                  <SingleOrderComponent key={order.idOrder} order={order} />
                ))}
            </div>
          </Container>
        </>
      )}
    </>
  );
};

export default RestaurantPastOrdersComponent;
