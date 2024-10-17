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
    <Container className="single-restaurant-past-order perfect-shadow mb-3 py-3 card me-3" style={{ width: "30%" }}>
      <Container className="single-restaurant-past-order__order-info mb-3">
        <h2 className="mb-3 fs-4">Order details</h2>
        {groupedProducts.map(({ product, count }) => (
          <div key={`${product.product.idProduct}_${JSON.stringify(product.toppings)}`} className="d-flex justify-content-between">
            <div className="d-flex">
              <p className="d-inline me-3">{count}X</p>
              <div className="d-flex flex-column">
                <p className="d-inline mb-0">{product.product.name}</p>
                {product.toppings.length > 0 &&
                  product.toppings.map((topping, index) => (
                    <Container key={index} className="d-flex justify-content-between ms-3 text-muted">
                      <small className="d">{topping.name}</small>
                    </Container>
                  ))}
              </div>
            </div>
            <p>{(product.price * count).toFixed(2)}€</p>
          </div>
        ))}
      </Container>
      <Container className="single-restaurant-past-order__user-info mb-3">
        <h2 className="mb-3 fs-4">Delivery details</h2>
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
          <h2 className="fs-4">Total</h2>
          <p>{order.totalPrice.toFixed(2)}€</p>
        </div>
      </Container>
    </Container>
  );
};

export default SingleRestaurantPastOrderComponent;
