import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const RiderActiveOrderComponent = () => {
  // ENV VARIABLES
  const ENV_VARIABLE = {
    URL_ORDERS: import.meta.env.VITE_ORDERS_URL
  };

  // HOOKS
  const navigate = useNavigate();

  // USE STATE
  const [order, setOrder] = useState(null);

  // FETCH
  const getActiveOrder = async () => {
    try {
      const response = await fetch(`${ENV_VARIABLE.URL_ORDERS}/rider/active-order`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
      if (response.ok) {
        setOrder(await response.json());
      } else {
        throw new Error("Could not find rider's current order - @getActiveOrder");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const refuseOrder = async () => {
    try {
      const response = await fetch(`${ENV_VARIABLE.URL_ORDERS}/${order.idOrder}/unassign-rider`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
      if (response.ok) {
        await response.json();
        navigate(0);
      } else {
        throw new Error("Could not refuse order. Please try again - @refuseOrder @RiderActiveOrderComponent");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const pickUpOrder = async () => {
    try {
      const response = await fetch(`${ENV_VARIABLE.URL_ORDERS}/${order.idOrder}/rider-pickup`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
      if (response.ok) {
        await response.json();
        navigate(0);
      } else {
        throw new Error("Could not pick up the order. Please try again - @pickUpOrder @RiderActiveOrderComponent");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const finaliseOrder = async () => {
    try {
      const response = await fetch(`${ENV_VARIABLE.URL_ORDERS}/${order.idOrder}/finalise`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
      if (response.ok) {
        await response.json();
        navigate(0);
      } else {
        throw new Error("Could not finalise the order. Please try again - @pickUpOrder @RiderActiveOrderComponent");
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
    if (order) {
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
    }
  };

  const groupedProducts = getGroupedOrderProducts();

  // USE EFFECT
  useEffect(() => {
    getActiveOrder();
  }, []);

  return (
    <>
      {order && (
        <Container className="my-3">
          <h4 className="text-center">Your current order</h4>
          <div className="card p-3 shadow mx-auto d-flex flex-column justify-content-center mb-3 mb-md-0 mt-3">
            <h4 className="single-active-order__header mb-3 fs-4">Order details</h4>
            <small className="mb-3">
              <span className="fw-bold">Order number: </span>
              {order.idOrder}
            </small>
            <small className="mb-3">
              <span className="fw-bold">Restaurant: </span>
              {order.restaurant.name}
              <a className="single-active-order__customer-phone small ms-2" href={`tel:+39${order.restaurant.phoneNumber}`}>
                {order.restaurant.phoneNumber}
              </a>
            </small>
            <small className="mb-3">
              <span className="fw-bold">Address: </span>
              {order.restaurant.address}
            </small>
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
              </div>
            ))}
            <h4 className="single-active-order__header mb-3 fs-4">Delivery details</h4>
            <small className="mb-3">
              <span className="fw-bold"> Customer: </span>
              {order.user.name} {order.user.surname}
              <span>
                <a className="single-active-order__customer-phone small ms-2" href={`tel:+39${order.user.phoneNumber}`}>
                  {order.user.phoneNumber}
                </a>
              </span>
            </small>
            <small className="mb-3">
              <span className="fw-bold"> Delivery address: </span>
              {order.deliveryAddress}
            </small>
            <small className="mb-3">
              <span className="fw-bold">Requested delivery time: </span>
              {formatDateTime(order.requestedDeliveryDateTime)}
            </small>
            <small>
              <span className="fw-bold">Order status: </span>
              <small className="">{order.orderStatus.orderStatus === "RESTAURANT_ACCEPTED" ? "ACCEPTED" : formatString(order.orderStatus.orderStatus)}</small>
            </small>
            {order.orderStatus.orderStatus === "RESTAURANT_ACCEPTED" && (
              <div className="single-active-order__cancel d-flex justify-content-center mt-3">
                <Button variant="danger" onClick={refuseOrder} className="me-3">
                  Refuse order
                </Button>
                <Button variant="success" onClick={pickUpOrder}>
                  Pick up
                </Button>
              </div>
            )}
            {order.orderStatus.orderStatus === "IN_TRANSIT" && (
              <div className="single-active-order__cancel d-flex justify-content-center mt-3">
                <Button variant="success" onClick={finaliseOrder} className="me-3">
                  Order delivered
                </Button>
              </div>
            )}
          </div>
        </Container>
      )}
    </>
  );
};

export default RiderActiveOrderComponent;
