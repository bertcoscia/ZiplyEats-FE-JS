import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./SingleActiveOrderComponent.css";

const SingleActiveOrderComponent = ({ order }) => {
  // ENV VARIABLES
  const ENV_VARIABLE = {
    URL_ORDERS: import.meta.env.VITE_ORDERS_URL
  };

  // HOOKS
  const navigate = useNavigate();

  // FETCH
  const acceptOrder = async () => {
    try {
      const response = await fetch(`${ENV_VARIABLE.URL_ORDERS}/${order.idOrder}/restaurant-accepts`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
      if (response.ok) {
        await response.json();
        navigate(0);
      } else {
        throw new Error("Could not accept the order. Please try again - @acceptOrder");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const refuseOrder = async () => {
    try {
      const response = await fetch(`${ENV_VARIABLE.URL_ORDERS}/${order.idOrder}/restaurant-refuses`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
      if (response.ok) {
        await response.json();
        navigate(0);
      } else {
        throw new Error("Could not refuse the order. Please try again - @refuseOrder");
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

  const formatString = str => {
    return str.replace(/_/g, " ");
  };

  const getGroupedOrderProducts = () => {
    const productCount = {};
    order.orderProductList.forEach(orderProduct => {
      const productKey = `${orderProduct.product.idProduct}_${JSON.stringify(orderProduct.toppings)}`;
      if (productCount[productKey]) {
        productCount[productKey].count += 1;
      } else {
        productCount[productKey] = {
          product: orderProduct,
          count: 1
        };
      }
    });

    return Object.values(productCount);
  };

  const groupedProducts = getGroupedOrderProducts();

  return (
    <div className="single-active-order card p-3 shadow mx-auto d-flex flex-column justify-content-center mb-3 mb-md-0">
      <small className="single-active-order__delivery-time mb-3 fw-bold">Requested delivery time: {formatDateTime(order.requestedDeliveryDateTime)}</small>
      <Container className="single-active-order__info mb-3">
        <h4 className="single-active-order__header mb-3 fs-4">Order details</h4>
        {groupedProducts.map(({ product, count }) => (
          <div key={`${product.product.idProduct}_${JSON.stringify(product.toppings)}`} className="single-active-order__product d-flex justify-content-between">
            <div className="single-active-order__product-info d-flex">
              <p className="single-active-order__product-quantity d-inline me-3">{count}X</p>
              <div className="single-active-order__product-details d-flex flex-column">
                <p className="single-active-order__product-name d-inline mb-0">{product.product.name}</p>
                {product.toppings.length > 0 &&
                  product.toppings.map((topping, index) => (
                    <Container key={index} className="single-active-order__topping d-flex justify-content-between ms-3 text-muted">
                      <small>{topping.name}</small>
                    </Container>
                  ))}
              </div>
            </div>
            <p className="single-active-order__product-price">{(product.price * count).toFixed(2)}€</p>
          </div>
        ))}
        <div className="single-active-order__total d-flex justify-content-between mt-3">
          <p className="fw-bold">Total:</p>
          <p>{order.totalPrice.toFixed(2)}€</p>
        </div>
        <div className="single-active-order__customer-info d-flex justify-content-between">
          <p>
            <span className="fw-bold">Customer:</span> {order.user.name} {order.user.surname}
          </p>
          <span>
            <a className="single-active-order__customer-phone small" href={`tel:+39${order.user.phoneNumber}`}>
              {order.user.phoneNumber}
            </a>
          </span>
        </div>
        <div className="single-active-order__rider-info d-flex justify-content-between">
          <p>
            <span className="fw-bold">Rider:</span> {order.rider ? `${order.rider.name} ${order.rider.surname}` : "Not assigned yet"}
          </p>
          {order.rider && (
            <span>
              <a className="single-active-order__rider-phone small" href={`tel:+39${order.rider.phoneNumber}`}>
                {order.rider.phoneNumber}
              </a>
            </span>
          )}
        </div>
        <div className="single-active-order__status d-flex justify-content-between mt-3">
          <p className="fw-bold">STATUS:</p>
          <p className="fw-bold">{order.orderStatus.orderStatus === "RESTAURANT_ACCEPTED" ? "ACCEPTED" : formatString(order.orderStatus.orderStatus)}</p>
        </div>
        {order.orderStatus.orderStatus === "CREATED" && (
          <div className="single-active-order__actions d-flex justify-content-around">
            <Button variant="danger" onClick={refuseOrder}>
              Refuse
            </Button>
            <Button variant="success" onClick={acceptOrder}>
              Accept
            </Button>
          </div>
        )}
        {order.orderStatus.orderStatus === "RESTAURANT_ACCEPTED" && (
          <div className="single-active-order__cancel d-flex justify-content-center">
            <Button variant="danger" onClick={refuseOrder}>
              Cancel order
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default SingleActiveOrderComponent;
