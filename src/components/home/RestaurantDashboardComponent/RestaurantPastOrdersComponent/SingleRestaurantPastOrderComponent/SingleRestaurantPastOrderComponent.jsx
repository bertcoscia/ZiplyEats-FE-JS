import { Container } from "react-bootstrap";

const SingleRestaurantPastOrderComponent = ({ order }) => {
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

  return (
    <Container className="single-restaurant-past-order perfect-shadow mb-3 py-3">
      <Container className="single-restaurant-past-order__order-info mb-3">
        <h2 className="mb-3">Order details</h2>
        {order.orderProductList.map(orderProduct => (
          <div key={orderProduct.idOrderProduct} className="d-flex justify-content-between">
            <div className="d-flex">
              <p className="d-inline me-3">1X</p>
              <div className="d-flex flex-column">
                <p className="d-inline mb-0">{orderProduct.product.name}</p>
                {orderProduct.toppings.length > 0 &&
                  orderProduct.toppings.map((topping, index) => (
                    <Container key={index} className="d-flex justify-content-between ms-3 text-muted">
                      <small className="d">{topping.name}</small>
                      {/* <small>+{topping.price}€</small> */}
                    </Container>
                  ))}
              </div>
            </div>
            <p>{orderProduct.price}€</p>
          </div>
        ))}
      </Container>
      <Container className="single-restaurant-past-order__user-info mb-3">
        <h2 className="mb-3">Delivery details</h2>
        <div className="d-flex">
          <img src="https://res.cloudinary.com/bertcoscia/image/upload/fl_preserve_transparency/v1728921447/file_eqnhsn.jpg?_s=public-apps" alt="" width={"15px"} className="align-self-center me-3" />
          <div className="d-flex flex-column">
            <p className="mb-0">{order.deliveryAddress}</p>
            <small className="text-muted">{formatDateTime(order.creationDateTime)}</small>
          </div>
        </div>
      </Container>
      <Container>
        <div className="d-flex justify-content-between">
          <h2>Total</h2>
          <p>{order.totalPrice}€</p>
        </div>
      </Container>
    </Container>
  );
};

export default SingleRestaurantPastOrderComponent;
