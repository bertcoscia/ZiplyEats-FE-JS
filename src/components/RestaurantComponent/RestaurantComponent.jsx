import { useEffect, useState } from "react";
import { useFetcher, useNavigate, useParams, useSearchParams } from "react-router-dom";
import NavComponent from "../NavComponent/NavComponent";
import { Button, Col, Container, Row } from "react-bootstrap";
import { StarFill, X, XLg } from "react-bootstrap-icons";
import SingleProductComponent from "../SingleProductComponent/SingleProductComponent";
import RestaurantProductsComponent from "./RestaurantProductsComponent";
import { useSelector } from "react-redux";

const RestaurantComponent = () => {
  // ENV VARIABLES
  const ENV_VARIABLES = {
    URL_RESTAURANTS: import.meta.env.VITE_RESTAURANTS_URL,
    URL_PRODUCTS: import.meta.env.VITE_PRODUCTS_URL,
    URL_ORDERS: import.meta.env.VITE_ORDERS_URL,
    URL_TOPPINGS: import.meta.env.VITE_TOPPINGS_URL
  };

  // HOOKS
  const idRestaurant = useParams();
  const navigate = useNavigate();
  const deliveryAddress = useSelector(state => state.deliveryAddress.content);

  // USE STATE
  const [restaurant, setRestaurant] = useState(null);
  const [products, setProducts] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [basket, setBasket] = useState([]);
  const [newOrderDTO, setNewOrderDTO] = useState(null);

  // FETCH
  const getRestaurant = async idRestaurant => {
    try {
      const response = await fetch(`${ENV_VARIABLES.URL_RESTAURANTS}/${idRestaurant}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
      if (response.ok) {
        setRestaurant(await response.json());
        getRestaurantProducts(idRestaurant);
        getRestauranToppings(idRestaurant);
      } else {
        throw new Error("Could not get restaurant");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRestaurantProducts = async idRestaurant => {
    try {
      const response = await fetch(`${ENV_VARIABLES.URL_PRODUCTS}/${idRestaurant}/products`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data.content);
      } else {
        throw new Error("Could not get restaurant");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createNewOrder = async newOrderDTO => {
    try {
      const response = await fetch(`${ENV_VARIABLES.URL_ORDERS}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-type": "application/json"
        },
        body: JSON.stringify(newOrderDTO)
      });
      if (response.ok) {
        await response.json();
        navigate(0);
      } else {
        throw new Error("Could not create new order");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRestauranToppings = async idRestaurant => {
    try {
      const response = await fetch(`${ENV_VARIABLES.URL_TOPPINGS}/${idRestaurant}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
      if (response.ok) {
        setToppings(await response.json());
      } else {
        throw new Error("Could not get toppings");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // HANDLERS
  const handleAddToBasket = (product, quantity) => {
    for (let i = 0; i < quantity; i++) {
      setBasket(prevState => [...prevState, product]);
    }
  };

  const handleRemoveFromBasket = productId => {
    const updatedBasket = basket.filter(product => product.idProduct !== productId);
    setBasket(updatedBasket);
  };

  const handleIncrementQuantity = productId => {
    setBasket(prevBasket => {
      const updatedBasket = [...prevBasket, prevBasket.find(product => product.idProduct === productId)];
      return updatedBasket;
    });
  };

  const handleDecrementQuantity = productId => {
    setBasket(prevBasket => {
      const productIndex = prevBasket.findIndex(product => product.idProduct === productId);
      if (productIndex !== -1) {
        const updatedBasket = [...prevBasket];
        updatedBasket.splice(productIndex, 1);
        return updatedBasket;
      }
      return prevBasket;
    });
  };

  const handleCreateNewOrder = (basket, requestedDeliveryDateTime) => {
    const newOrder = {
      idRestaurant: `${restaurant.idUser}`,
      deliveryAddress: `${deliveryAddress.address}`,
      requestedDeliveryDateTime: `${requestedDeliveryDateTime}`,
      orderProductList: basket.map(product => ({
        idProduct: `${product.idProduct}`
      }))
    };
    createNewOrder(newOrder);
  };

  // UTILS
  const getUniqueCategories = products => {
    const categories = products.map(product => product.productCategory.productCategory);
    const uniqueCategories = [...new Set(categories)];
    return uniqueCategories;
  };

  // USE EFFECT
  useEffect(() => {
    getRestaurant(idRestaurant.id);
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const uniqueCategories = getUniqueCategories(products);
      setProductCategories(uniqueCategories);
    }
  }, [products]);

  return (
    <>
      <NavComponent />
      {restaurant && (
        <div style={{ marginTop: "80px" }}>
          <div className="bg-primary pb-4">
            <Container>
              <Button
                variant="link"
                className="text-decoration-none text-secondary"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  navigate(-1);
                }}
              >
                <small>
                  <svg height="24" width="24" viewBox="0 0 24 24" role="img" aria-label="Back" focusable="false" fill="#f9c90b">
                    <path d="M9.6 5.5L11.1556 7.05558L7.21126 11H21V13H7.21126L11.1556 16.9443L9.6 18.5L3 12L9.6 5.5Z"></path>
                  </svg>
                  Go back
                </small>
              </Button>
              <div className="d-flex">
                <div className="me-4">
                  <img src={restaurant.avatarUrl} alt="" style={{ width: "200px", height: "200px" }} className="rounded-2" />
                </div>
                <div className="d-flex flex-column">
                  <h1 style={{ fontSize: "28px" }}>{restaurant.name}</h1>
                  <small className="mb-2 fst-italic">{restaurant.restaurantCategory.restaurantCategory}</small>
                  <small className="mb-2">{restaurant.address}</small>
                  <a className="rider-active-order__customer-phone small mb-2 text-text" href={`tel:+39${restaurant.phoneNumber}`}>
                    {restaurant.phoneNumber}
                  </a>
                  <small className="d-flex align-items-center mt-2">
                    <StarFill fill="#f9c90b" className="me-1" width={"24px"} />
                    <small>{restaurant.rating.toFixed(1)}</small>
                  </small>
                </div>
              </div>
            </Container>
          </div>
          <Container className="d-flex mt-4">
            {products.length > 0 && <RestaurantProductsComponent products={products} productCategories={productCategories} handleAddToBasket={handleAddToBasket} basket={basket} toppings={toppings} />}
            <div className="d-none d-lg-block card perfect-shadow p-3 align-self-start sticky-top" style={{ width: "315px", top: "90px" }}>
              <h5>Your order</h5>
              <div className="d-flex flex-column">
                {basket.length > 0 ? (
                  <>
                    {Object.entries(
                      basket.reduce((acc, product) => {
                        acc[product.idProduct] = acc[product.idProduct] || { count: 0, price: product.price, name: product.name };
                        acc[product.idProduct].count += 1;
                        return acc;
                      }, {})
                    ).map(([idProduct, { count, price, name }]) => (
                      <div key={idProduct} className="mb-3 p-1 border-bottom border-2 pb-3">
                        <div className="d-flex align-items-center">
                          <small style={{ fontSize: "12px" }} className="me-auto">
                            {count}x {name}
                          </small>
                          <small className="text-muted ms-3 d-block fst-italic" style={{ fontSize: "12px" }}>
                            {(count * price).toFixed(2)} €
                          </small>
                        </div>
                        <div className="d-flex justify-content-center mt-2">
                          <Button variant="primary" className="align-self-center px-2 py-0 me-3" onClick={() => handleDecrementQuantity(idProduct)}>
                            <small>-</small>
                          </Button>
                          <Button variant="primary" className="align-self-center px-2 py-0" onClick={() => handleIncrementQuantity(idProduct)}>
                            <small>+</small>
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="">
                      <div className="d-flex justify-content-between">
                        <strong>Total</strong>
                        <strong>{basket.reduce((total, product) => total + product.price, 0).toFixed(2)} €</strong>
                      </div>
                    </div>
                    <Button
                      variant="accent"
                      className="mt-3 py-0"
                      onClick={() => {
                        handleCreateNewOrder(basket, "2024-10-29T22:30:00");
                      }}
                    >
                      <small>Order</small>
                    </Button>
                  </>
                ) : (
                  <p>Your basket is empty</p>
                )}
              </div>
            </div>
          </Container>
        </div>
      )}
    </>
  );
};

export default RestaurantComponent;
