import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavComponent from "./NavComponent/NavComponent";
import { Container } from "react-bootstrap";

const LocalRestaurantsComponent = () => {
  // ENV VARIABLES
  const ENV_VARIABLE = {
    URL_RESTAURANTS: import.meta.env.VITE_RESTAURANTS_URL
  };

  // USE STATE
  const [restaurants, setRestaurants] = useState([]);

  // HOOKS
  const deliveryAddress = useParams();

  // FETCH
  const findRestaurantsByCity = async city => {
    try {
      const response = await fetch(`${ENV_VARIABLE.URL_RESTAURANTS}/find-city`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
      if (response.ok) {
        const page = await response.json();
        setRestaurants(page.content);
      } else {
        throw new Error("Could not get restaurants - @findRestaurantsByCity");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    findRestaurantsByCity(deliveryAddress.city);
  }, []);

  return (
    <>
      <NavComponent />
      <Container style={{ marginTop: "80px" }}>
        {restaurants.length > 0 &&
          restaurants.map(restaurant => (
            <div className="card" key={restaurant.idUser}>
              {restaurant.name}
            </div>
          ))}
      </Container>
    </>
  );
};

export default LocalRestaurantsComponent;
