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
    <Container className="single-past-order perfect-shadow py-3 card">
      <Container className="single-past-order__order-info">
        <h2 className="single-past-order__title mb-2 fs-5">Order details</h2>
        <div className="single-past-order__details d-flex flex-column">
          {(userRole === "RESTAURANT" || userRole === "RIDER") && (
            <small className="single-past-order__id mb-3 fw-light">
              <span className="fw-medium">Id: </span>
              {order.idOrder}
            </small>
          )}
          <small className="single-past-order__status mb-3 fw-light">
            <span className="fw-medium">Order status: </span>
            {order.orderStatus.orderStatus}
          </small>
          <small className="single-past-order__restaurant mb-3 fw-light">
            <span className="fw-medium">Restaurant: </span>
            {order.restaurant.name}
          </small>
          <small className="single-past-order__address mb-3 fw-light">
            <span className="fw-medium">Address: </span>
            {formatAddress(order.restaurant.address)}
          </small>
        </div>
        {!isRider &&
          groupedProducts.map(({ product, count }) => (
            <div key={`${product.product.idProduct}_${JSON.stringify(product.toppings)}`} className="single-past-order__product d-flex justify-content-between">
              <div className="single-past-order__product-info d-flex">
                <p className="single-past-order__product-count d-inline me-3 small">{count}X</p>
                <div className="single-past-order__product-details d-flex flex-column mb-3">
                  <p className="single-past-order__product-name d-inline mb-0 small">{product.product.name}</p>
                  {product.toppings.length > 0 &&
                    product.toppings.map((topping, index) => (
                      <Container key={index} className="single-past-order__topping d-flex justify-content-between text-muted">
                        <small className="single-past-order__topping-name">+ {topping.name}</small>
                      </Container>
                    ))}
                </div>
              </div>
              <p className="single-past-order__product-price small">{(product.price * count).toFixed(2)}€</p>
            </div>
          ))}
      </Container>
      <Container className="single-past-order__user-info mt-auto mb-3">
        <h2 className="single-past-order__delivery-title mb-3 fs-5">Delivery details</h2>
        <div className="single-past-order__delivery-details d-flex flex-column">
          <small className="single-past-order__delivery-address mb-3 fw-light">
            <span className="fw-medium">Delivery address: </span>
            {formatAddress(order.deliveryAddress)}
          </small>
          {order.orderStatus.orderStatus === "DELIVERED" && (
            <small className="single-past-order__delivery-time mb-3 fw-light">
              <span className="fw-medium">Delivery time: </span>
              {formatDateTime(order.actualDeliveryDateTime)}
            </small>
          )}
        </div>
      </Container>
      {!isRider && (
        <Container className="single-past-order__total mt-auto">
          <div className="single-past-order__total-info d-flex justify-content-between">
            <h2 className="single-past-order__total-title fs-5">Total</h2>
            <p className="single-past-order__total-price">{order.totalPrice.toFixed(2)}€</p>
          </div>
        </Container>
      )}
    </Container>
  );
};

export default SinglePastOrderComponent;
