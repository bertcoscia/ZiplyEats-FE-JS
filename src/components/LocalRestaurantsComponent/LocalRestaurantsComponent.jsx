import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavComponent from "../NavComponent/NavComponent";
import { Button, Container } from "react-bootstrap";
import SingleRestaurantCard from "../SingleRestaurantComponent/SingleRestaurantCard";
import "./LocalRestaurantsComponent.css";

const LocalRestaurantsComponent = () => {
  // ENV VARIABLES
  const ENV_VARIABLES = {
    URL_RESTAURANTS: import.meta.env.VITE_RESTAURANTS_URL,
    GEOAPIFY_KEY: import.meta.env.VITE_GEOAPIFY_KEY,
    URL_RESTAURANT_CATEGORIES: import.meta.env.VITE_RESTAURANT_CATEGORIES_URL
  };

  // HOOKS
  const deliveryAddress = useParams();
  const navigate = useNavigate();

  // USE STATE
  const [restaurants, setRestaurants] = useState([]);
  const [nearRestaurants, setNearRestaurants] = useState([]);
  const [nearRestaurantsCategories, setNearRestaurantsCategories] = useState(["Kebab", "Pizza", "Japanese"]);

  // FETCH
  const findRestaurantsByCity = async () => {
    try {
      const response = await fetch(`${ENV_VARIABLES.URL_RESTAURANTS}/find-city`, {
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

  const filterByDistance = async restaurant => {
    try {
      const response = await fetch(`https://api.geoapify.com/v1/routing?waypoints=${deliveryAddress.lat},${deliveryAddress.lon}|${restaurant.latitude},${restaurant.longitude}&mode=bicycle&apiKey=${ENV_VARIABLES.GEOAPIFY_KEY}`);
      if (response.ok) {
        const data = await response.json();
        if (data.features[0].properties.distance <= 7000) {
          setNearRestaurants(prevState => [...prevState, restaurant]);
        }
      } else {
        console.error("Failed to fetch distance data");
      }
    } catch (error) {
      console.error("Error during filterByDistance:", error);
    }
  };

  // UTILS
  const getUniqueCategories = restaurants => {
    const categories = restaurants.map(restaurant => restaurant.restaurantCategory.restaurantCategory);
    const uniqueCategories = [...new Set(categories)];
    return uniqueCategories;
  };

  // USE EFFECT per filtrare i ristoranti in base alla distanza
  /* useEffect(() => {
    if (restaurants.length > 0) {
      restaurants.forEach(restaurant => filterByDistance(restaurant));
    }
  }, [restaurants]); */

  // USE EFFECT per aggiornare le categorie uniche una volta che nearRestaurants viene aggiornato
  /* useEffect(() => {
    if (nearRestaurants.length > 0) {
      const uniqueCategories = getUniqueCategories(nearRestaurants);
      setNearRestaurantsCategories(uniqueCategories);
    }
  }, [nearRestaurants]); */

  // USE EFFECT per trovare i ristoranti in base all'indirizzo di consegna
  useEffect(() => {
    if (deliveryAddress.lat && deliveryAddress.lon) {
      findRestaurantsByCity();
    }
  }, [deliveryAddress.lat, deliveryAddress.lon]);

  return (
    <>
      <NavComponent />
      <Container style={{ marginTop: "80px" }}>
        <div className="pt-5">
          <h2 className="text-center">Most popular in your area</h2>
          <div className="my-5 d-flex flex-wrap">
            {nearRestaurantsCategories.map((category, index) => (
              <Button
                key={index}
                className="category-button py-0 me-3 rounded-pill"
                onClick={() => {
                  navigate(`/restaurants/${category}/${deliveryAddress.lat}/${deliveryAddress.lon}`);
                }}
              >
                <small>{category}</small>
              </Button>
            ))}
          </div>
          <div className="d-flex justify-content-around flex-wrap">{nearRestaurants.length > 0 ? nearRestaurants.map(restaurant => <SingleRestaurantCard key={restaurant.idUser} restaurant={restaurant} />) : <p>No nearby restaurants found</p>}</div>
        </div>
      </Container>
    </>
  );
};

export default LocalRestaurantsComponent;
