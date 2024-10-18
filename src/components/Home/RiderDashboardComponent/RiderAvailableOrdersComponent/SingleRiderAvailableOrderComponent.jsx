import { Button } from "react-bootstrap";
import "./SingleRiderAvailableOrderComponent.css";
import { useNavigate } from "react-router-dom";

const SingleRiderAvailableOrderComponent = ({ order }) => {
  // ENV VARIABLES
  const ENV_VARIABLE = {
    URL_ORDERS: import.meta.env.VITE_ORDERS_URL
  };

  // HOOKS
  const navigate = useNavigate();

  // FETCH
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

  return (
    <div key={order.idOrder} className="single-rider-available-order d-flex flex-column card p-3 shadow mx-auto d-flex flex-column justify-content-center mb-3 mb-md-0 mt-3">
      <small className="single-rider-available-order__restaurant-name mb-3">
        <span className="fw-bold">Restaurant: </span>
        {order.restaurant.name}
      </small>
      <small className="single-rider-available-order__restaurant-address mb-3">
        <span className="fw-bold">Address: </span>
        {formatAddress(order.restaurant.address)}
      </small>
      <small className="single-rider-available-order__delivery-address mb-3">
        <span className="fw-bold">Delivery address: </span>
        {formatAddress(order.deliveryAddress)}
      </small>
      <small className="single-rider-available-order__requested-delivery-time mb-3">
        <span className="fw-bold">Requested delivery time: </span>
        {formatDateTime(order.requestedDeliveryDateTime)}
      </small>
      <Button className="single-rider-available-order__accept-button align-self-center" variant="primary" onClick={() => riderAcceptsOrder(order.idOrder)}>
        Accept order
      </Button>
    </div>
  );
};

export default SingleRiderAvailableOrderComponent;
