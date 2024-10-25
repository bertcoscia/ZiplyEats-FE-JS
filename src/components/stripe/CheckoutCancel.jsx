import { Container } from "react-bootstrap";
import NavComponent from "../NavComponent/NavComponent";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const CheckoutCancel = () => {
  // ENV VARIABLES
  const ENV_VARIABLE = {
    URL_ORDERS: import.meta.env.VITE_ORDERS_URL
  };

  // HOOKS
  const idOrder = useParams();
  const navigate = useNavigate();

  // USE STATE
  const [isOrderCancelled, setIsOrderCancelled] = useState(false);
  const [countdown, setCountdown] = useState(7);

  // FETCH
  const cancelOrder = async () => {
    try {
      const response = await fetch(`${ENV_VARIABLE.URL_ORDERS}/${idOrder.idOrder}/user-cancel-order`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
      if (response.ok) {
        setIsOrderCancelled(true);
      } else {
        throw new Error("Could not cancel the order");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // USE EFFECT
  useEffect(() => {
    cancelOrder();
  }, []);

  useEffect(() => {
    if (isOrderCancelled) {
      const timer = setInterval(() => {
        setCountdown(prevCount => prevCount - 1);
      }, 1000);

      const redirectTimeout = setTimeout(() => {
        navigate("/");
      }, 7000);

      return () => {
        clearInterval(timer);
        clearTimeout(redirectTimeout);
      };
    }
  }, [isOrderCancelled, navigate]);

  return (
    <>
      {isOrderCancelled && (
        <>
          <NavComponent />
          <Container style={{ marginTop: "80px" }}>
            <h1 className="text-center pt-5">Order cancelled</h1>
            <p className="text-center">You will automatically be redirected to the home page in {countdown} seconds</p>
          </Container>
        </>
      )}
    </>
  );
};

export default CheckoutCancel;
