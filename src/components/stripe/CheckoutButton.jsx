import { loadStripe } from "@stripe/stripe-js";

const CheckoutButton = ({ cart, restaurant, deliveryAddress }) => {
  // ENV VARIABLES
  const ENV_VARIABLES = {
    URL_BACKEND: import.meta.env.VITE_BACKEND_URL,
    URL_ORDERS: import.meta.env.VITE_ORDERS_URL
  };

  // HANDLERS
  const handleCheckout = () => {
    const newOrder = handleCreateNewOrder(cart, "2024-10-31T18:30:00");
    createNewOrder(newOrder);
  };

  const handleCreateNewOrder = (cart, requestedDeliveryDateTime) => {
    const newOrder = {
      idRestaurant: `${restaurant.idUser}`,
      deliveryAddress: `${deliveryAddress.address}`,
      requestedDeliveryDateTime: `${requestedDeliveryDateTime}`,
      orderProductList: cart.map(orderProduct => ({
        idProduct: `${orderProduct.product.idProduct}`,
        toppings: orderProduct.toppings.map(topping => topping.idProduct)
      }))
    };
    return newOrder;
  };

  // FETCH
  const fetchCheckout = async idOrder => {
    try {
      const response = await fetch(`${ENV_VARIABLES.URL_BACKEND}/create-checkout-session`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(idOrder)
      });

      const { id } = await response.json();

      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_KEY);
      const { error } = await stripe.redirectToCheckout({ sessionId: id });

      if (error) {
        console.error("Error redirecting to checkout:", error);
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
        const data = await response.json();
        fetchCheckout(data.id);
      } else {
        throw new Error("Could not create new order");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return <button onClick={handleCheckout}>Go to checkout</button>;
};

export default CheckoutButton;
