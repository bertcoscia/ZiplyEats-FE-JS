import { useEffect, useState } from "react";
import NavComponent from "../../../navbar/NavComponent";
import { Container } from "react-bootstrap";
import SingleOrderComponent from "../../../single orders/SingleRestaurantPastOrderComponent";

const RestaurantPastOrdersComponent = () => {
  const ORDERS_URL = import.meta.env.VITE_ORDERS_URL;

  const [restaurantPastOrders, setRestaurantPastOrders] = useState([]);

  const getRestaurantPastOrders = () => {
    fetch(`${ORDERS_URL}/my-orders/restaurant`, {
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

  useEffect(() => {
    getRestaurantPastOrders();
  }, []);

  return (
    <>
      <NavComponent />

      {restaurantPastOrders.length > 0 && (
        <Container style={{ marginTop: "110px" }}>
          <h1>Past Orders</h1>
          {restaurantPastOrders
            .sort((a, b) => new Date(b.creationDateTime) - new Date(a.creationDateTime))
            .map(order => (
              <SingleOrderComponent key={order.idOrder} order={order} />
            ))}
        </Container>
      )}
    </>
  );
};

export default RestaurantPastOrdersComponent;
