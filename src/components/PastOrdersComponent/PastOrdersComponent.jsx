import { useEffect, useState } from "react";
import NavComponent from "../NavComponent/NavComponent";
import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import SinglePastOrderComponent from "./SinglePastOrderComponent";
import { useSelector } from "react-redux";

const PastOrdersComponent = () => {
  // ENV VARIABLES
  const ENV_VARIABLE = {
    URL_ORDERS: import.meta.env.VITE_ORDERS_URL
  };

  // HOOKS
  const profile = useSelector(state => state.profile.content);

  // USE STATE
  const [restaurantPastOrders, setRestaurantPastOrders] = useState([]);

  // FETCH
  const getPastOrders = role => {
    fetch(`${ENV_VARIABLE.URL_ORDERS}/my-orders/${role}/past-orders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("There was an error while retrieving your past orders - @getPastOrdersAction");
        }
      })
      .then(data => {
        setRestaurantPastOrders(data.content);
      })
      .catch(error => console.log(error));
  };

  // USE EFFECT
  useEffect(() => {
    if (profile) {
      let role = "";
      switch (profile.userRole.userRole) {
        case "USER":
          role = "user";
          break;
        case "RIDER":
          role = "rider";
          break;
        case "RESTAURANT":
          role = "restaurant";
          break;
        default:
          return;
      }
      getPastOrders(role);
    }
  }, [profile]);

  return (
    <>
      <NavComponent />
      <Container style={{ marginTop: "110px" }} className="mb-3">
        {profile && (
          <>
            {restaurantPastOrders.length > 0 ? (
              <>
                <h1 className="text-center mb-3">Past Orders</h1>
                <Button as={Link} to={"/home"} variant="link" className="text-decoration-none mb-3">
                  Go back
                </Button>
                <div className="d-flex flex-wrap justify-content-start column-gap-1 row-gap-3">
                  {restaurantPastOrders
                    .sort((a, b) => new Date(b.creationDateTime) - new Date(a.creationDateTime))
                    .map(order => (
                      <SinglePastOrderComponent key={order.idOrder} order={order} userRole={profile.userRole.userRole} />
                    ))}
                </div>
              </>
            ) : (
              <h4 className="text-center pt-5">There are no past orders</h4>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default PastOrdersComponent;
