import { useEffect, useState } from "react";
import { useFetcher, useNavigate, useParams, useSearchParams } from "react-router-dom";
import NavComponent from "../NavComponent/NavComponent";
import { Button, Col, Container, Row } from "react-bootstrap";
import { SkipEnd, StarFill, X, XLg } from "react-bootstrap-icons";
import SingleProductComponent from "../SingleProductComponent/SingleProductComponent";
import RestaurantProductsComponent from "./RestaurantProductsComponent";
import { useSelector } from "react-redux";
import CheckoutButton from "../stripe/CheckoutButton";
import OrderDateTimePicker from "../OrderDateTimePicker";

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
  const deliveryAddress = JSON.parse(sessionStorage.getItem("deliveryAddress"));

  // USE STATE
  const [restaurant, setRestaurant] = useState(null);
  const [products, setProducts] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [newOrderDTO, setNewOrderDTO] = useState(null);
  const [deliveryDateTime, setDeliveryDateTime] = useState("");

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
        setProducts(data);
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
  const handleAddToCart = (product, quantity, selectedToppings) => {
    for (let i = 0; i < quantity; i++) {
      setCart(prevState => [
        ...prevState,
        {
          product: product,
          toppings: selectedToppings
        }
      ]);
    }
  };

  const handleRemoveFromCart = productId => {
    const updatedCart = cart.filter(product => product.idProduct !== productId);
    setCart(updatedCart);
  };

  const handleIncrementQuantity = productKey => {
    setCart(prevCart => {
      const productToIncrement = prevCart.find(product => `${product.product.idProduct}_${JSON.stringify(product.toppings)}` === productKey);
      return [...prevCart, productToIncrement];
    });
  };

  const handleDecrementQuantity = productKey => {
    setCart(prevCart => {
      const productIndex = prevCart.findIndex(product => `${product.product.idProduct}_${JSON.stringify(product.toppings)}` === productKey);
      if (productIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart.splice(productIndex, 1);
        return updatedCart;
      }
      return prevCart;
    });
  };

  const handleDeliveryDateTimeChange = event => {
    setDeliveryDateTime(event.target.value);
  };

  /* const handleCreateNewOrder = (cart, requestedDeliveryDateTime) => {
    const newOrder = {
      idRestaurant: `${restaurant.idUser}`,
      deliveryAddress: `${deliveryAddress.address}`,
      requestedDeliveryDateTime: `${requestedDeliveryDateTime}`,
      orderProductList: cart.map(orderProduct => ({
        idProduct: `${orderProduct.product.idProduct}`,
        toppings: orderProduct.toppings.map(topping => topping.idProduct)
      }))
    };
    createNewOrder(newOrder);
  }; */

  // UTILS
  const getUniqueCategories = products => {
    const categories = products.map(product => product.productCategory.productCategory);
    const uniqueCategories = [...new Set(categories)];
    return uniqueCategories;
  };

  const roundToNextQuarterHour = date => {
    const roundedMinutes = Math.ceil(date.getMinutes() / 15) * 15;
    date.setMinutes(roundedMinutes, 0, 0);
    return date;
  };

  const getRoundedDateTimePlus30Minutes = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    const roundedDate = roundToNextQuarterHour(now);
    const year = roundedDate.getFullYear();
    const month = String(roundedDate.getMonth() + 1).padStart(2, "0");
    const day = String(roundedDate.getDate()).padStart(2, "0");
    const hours = String(roundedDate.getHours()).padStart(2, "0");
    const minutes = String(roundedDate.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // USE EFFECT
  useEffect(() => {
    getRestaurant(idRestaurant.id);
    const minDate = getRoundedDateTimePlus30Minutes();
    setDeliveryDateTime(minDate);
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
          <div className="bg-primary py-4">
            <Container>
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
          <Container className="py-3">
            <Button
              variant="link"
              className="text-decoration-none text-primary"
              style={{ cursor: "pointer" }}
              onClick={() => {
                navigate(-1);
              }}
            >
              <small>
                <svg height="24" width="24" viewBox="0 0 24 24" role="img" aria-label="Back" focusable="false" fill="#F86826">
                  <path d="M9.6 5.5L11.1556 7.05558L7.21126 11H21V13H7.21126L11.1556 16.9443L9.6 18.5L3 12L9.6 5.5Z"></path>
                </svg>
                Go back
              </small>
            </Button>
          </Container>
          <Container className="d-flex mt-4">
            {products.length > 0 && <RestaurantProductsComponent products={products} productCategories={productCategories} handleAddToCart={handleAddToCart} cart={cart} toppings={toppings} />}
            <div className="d-none d-lg-block card perfect-shadow p-3 align-self-start sticky-top" style={{ width: "315px", top: "90px" }}>
              <h5>Your order</h5>
              <div className="d-flex flex-column">
                {cart.length > 0 ? (
                  <>
                    {Object.entries(
                      cart.reduce((acc, product) => {
                        const productKey = `${product.product.idProduct}_${JSON.stringify(product.toppings)}`;
                        if (!acc[productKey]) {
                          acc[productKey] = {
                            count: 0,
                            product: product.product,
                            toppings: product.toppings
                          };
                        }
                        acc[productKey].count += 1;
                        return acc;
                      }, {})
                    ).map(([productKey, { count, product, toppings }]) => {
                      const toppingsPrice = toppings.reduce((total, topping) => total + topping.price, 0);
                      const totalPrice = (product.price + toppingsPrice) * count;
                      return (
                        <div key={productKey} className="mb-3 p-1 border-bottom border-2 pb-3">
                          <div className="d-flex align-items-center">
                            <small style={{ fontSize: "12px" }} className="me-auto">
                              {count}x {product.name}
                            </small>
                            <small className="text-muted ms-3 d-block fst-italic" style={{ fontSize: "12px" }}>
                              {totalPrice.toFixed(2)} €
                            </small>
                          </div>
                          <div className="d-flex flex-column ms-3">
                            {toppings.length > 0 &&
                              toppings.map((topping, index) => (
                                <small key={index} className="text-muted" style={{ fontSize: "10px" }}>
                                  + {topping.name} ({topping.price.toFixed(2)} €)
                                </small>
                              ))}
                          </div>
                          <div className="d-flex justify-content-center mt-2">
                            <Button variant="primary" className="align-self-center px-2 py-0 me-3" onClick={() => handleDecrementQuantity(productKey)}>
                              <small>-</small>
                            </Button>
                            <Button variant="primary" className="align-self-center px-2 py-0" onClick={() => handleIncrementQuantity(productKey)}>
                              <small>+</small>
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                    <div className="">
                      <div className="d-flex justify-content-between">
                        <strong>Total</strong>
                        <strong>
                          {cart
                            .reduce((total, product) => {
                              const toppingsPrice = product.toppings.reduce((total, topping) => total + topping.price, 0);
                              return total + (product.product.price + toppingsPrice);
                            }, 0)
                            .toFixed(2)}{" "}
                          €
                        </strong>
                      </div>
                    </div>
                    <OrderDateTimePicker setDeliveryDateTime={setDeliveryDateTime} />
                    <CheckoutButton cart={cart} restaurant={restaurant} deliveryAddress={deliveryAddress} requestedDeliveryDateTime={deliveryDateTime} />
                  </>
                ) : (
                  <p>Your cart is empty</p>
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
