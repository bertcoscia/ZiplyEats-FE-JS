import { Container } from "react-bootstrap";
import "./SinglePastOrderComponent.css";
import { useEffect, useState } from "react";

const SinglePastOrderComponent = ({ order, userRole }) => {
  // USE STATE
  const [isRider, setIsRider] = useState(false);

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
    return `${street}, ${streetNumber}`;
  }

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

  // USE EFFECT
  useEffect(() => {
    if (userRole === "RIDER") {
      setIsRider(true);
    } else {
      setIsRider(false);
    }
  }, []);

  return (
    <Container className="single-restaurant-past-order perfect-shadow mb-3 py-3 card mx-auto">
      <Container className="single-restaurant-past-order__order-info">
        <h2 className="mb-2 fs-5">Order details</h2>
        <div className="d-flex flex-column">
          {(userRole === "RESTAURANT" || userRole === "RIDER") && (
            <small className="mb-3 fw-light">
              <span className="fw-medium">Id: </span>
              {order.idOrder}
            </small>
          )}
          <small className="mb-3 fw-light">
            <span className="fw-medium">Order status: </span>
            {order.orderStatus.orderStatus}
          </small>
          <small className="mb-3 fw-light">
            <span className="fw-medium">Restaurant: </span>
            {order.restaurant.name}
          </small>
          <small className="mb-3 fw-light">
            <span className="fw-medium">Address: </span>
            {formatAddress(order.restaurant.address)}
          </small>
        </div>
        {!isRider &&
          groupedProducts.map(({ product, count }) => (
            <div key={`${product.product.idProduct}_${JSON.stringify(product.toppings)}`} className="d-flex justify-content-between">
              <div className="d-flex">
                <p className="d-inline me-3 small">{count}X</p>
                <div className="d-flex flex-column mb-3">
                  <p className="d-inline mb-0 small">{product.product.name}</p>
                  {product.toppings.length > 0 &&
                    product.toppings.map((topping, index) => (
                      <Container key={index} className="d-flex justify-content-between text-muted">
                        <small>{topping.name}</small>
                      </Container>
                    ))}
                </div>
              </div>
              <p className="small">{(product.price * count).toFixed(2)}€</p>
            </div>
          ))}
      </Container>
      <Container className="single-restaurant-past-order__user-info mt-auto mb-3">
        <h2 className="mb-3 fs-5">Delivery details</h2>
        <div className="d-flex flex-column">
          <small className="mb-3 fw-light">
            <span className="fw-medium">Delivery address: </span>
            {formatAddress(order.deliveryAddress)}
          </small>
          {order.orderStatus.orderStatus === "DELIVERED" && (
            <small className="mb-3 fw-light">
              <span className="fw-medium">Delivery time: </span>
              {formatDateTime(order.actualDeliveryDateTime)}
            </small>
          )}
        </div>
      </Container>
      {!isRider && (
        <Container className="mt-auto">
          <div className="d-flex justify-content-between">
            <h2 className="fs-5">Total</h2>
            <p>{order.totalPrice.toFixed(2)}€</p>
          </div>
        </Container>
      )}
    </Container>
  );
};

export default SinglePastOrderComponent;
