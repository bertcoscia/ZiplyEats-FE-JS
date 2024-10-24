import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import NavComponent from "../NavComponent/NavComponent";
import { Button, Container } from "react-bootstrap";
import PastOrdersComponent from "../PastOrdersComponent/PastOrdersComponent";
import SingleActiveOrderComponent from "../home/RestaurantDashboardComponent/RestaurantActiveOrdersComponent/SingleActiveOrderComponent";

const CheckoutSuccess = () => {
  // ENV VARIABLES
  const ENV_VARIABLES = {
    URL_ORDERS: import.meta.env.VITE_ORDERS_URL
  };

  // HOOKS
  const idOrder = useParams();
  const navigate = useNavigate();

  // USE STATE
  const [order, setOrder] = useState(null);

  // FETCH
  const getOrder = async () => {
    try {
      const response = await fetch(`${ENV_VARIABLES.URL_ORDERS}/my-orders/${idOrder.idOrder}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
      if (response.ok) {
        setOrder(await response.json());
      } else {
        throw new Error("Could not retrieve order.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // USE EFFECT
  useEffect(() => {
    getOrder();
  }, []);

  return (
    <>
      <NavComponent />
      {order && (
        <Container style={{ marginTop: "80px" }}>
          <div className="pt-5 d-flex flex-column aling-items-center">
            <h1 className="text-center mb-5">Order confirmed!</h1>
            <SingleActiveOrderComponent order={order} userRole={"USER"} />
            <Button
              variant="link"
              onClick={() => {
                navigate("/");
              }}
              className="text-decoration-none text-primary pt-3"
            >
              <small>Go back to home page</small>
            </Button>
          </div>
        </Container>
      )}
    </>
  );
};

export default CheckoutSuccess;
