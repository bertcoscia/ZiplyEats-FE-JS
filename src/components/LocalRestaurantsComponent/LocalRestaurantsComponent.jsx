import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavComponent from "../NavComponent/NavComponent";
import { Button, Container, Form } from "react-bootstrap";
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
  const deliveryAddress = JSON.parse(sessionStorage.getItem("deliveryAddress"));
  const navigate = useNavigate();

  // USE STATE
  const [restaurants, setRestaurants] = useState([]);
  const [nearRestaurants, setNearRestaurants] = useState([]);
  const [nearRestaurantsCategories, setNearRestaurantsCategories] = useState([]);
  const [search, setSearch] = useState("");

  // HANDLERS
  const handleSearchChange = event => {
    setSearch(event.target.value);
  };

  // FETCH
  const findRestaurantsByCity = async () => {
    try {
      const response = await fetch(`${ENV_VARIABLES.URL_RESTAURANTS}/find-city/${deliveryAddress.city}`, {
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
      const response = await fetch(`https://api.geoapify.com/v1/routing?waypoints=${deliveryAddress.latitude},${deliveryAddress.longitude}|${restaurant.latitude},${restaurant.longitude}&mode=bicycle&apiKey=${ENV_VARIABLES.GEOAPIFY_KEY}`);
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

  const resetSearch = () => {
    setSearch("");
  };

  // USE EFFECT
  useEffect(() => {
    if (restaurants.length > 0) {
      restaurants.forEach(restaurant => filterByDistance(restaurant));
    }
  }, [restaurants]);

  useEffect(() => {
    if (nearRestaurants.length > 0) {
      const uniqueCategories = getUniqueCategories(nearRestaurants);
      setNearRestaurantsCategories(uniqueCategories);
    }
  }, [nearRestaurants]);

  useEffect(() => {
    findRestaurantsByCity();
  }, []);

  return (
    <>
      <NavComponent />
      <Container style={{ marginTop: "80px" }}>
        <div className="pt-5">
          <h2 className="text-center">Most popular in your area</h2>
          <div className="edit-menu__search d-flex justify-content-center">
            <Form className="edit-menu__search-form my-3">
              <Form.Group>
                <Form.Control type="text" value={search} placeholder="Search for a restaurant" onChange={handleSearchChange} className="edit-menu__search-input py-1" />
              </Form.Group>
            </Form>
            <Button variant="accent" className="edit-menu__reset-button ms-3 align-self-center py-1" onClick={resetSearch}>
              Reset
            </Button>
          </div>
          <Container className="my-5 d-flex flex-wrap">
            {nearRestaurantsCategories.map((category, index) => (
              <Button
                key={index}
                className="category-button py-0 me-3 rounded-pill"
                onClick={() => {
                  navigate(`/restaurants/${category}`);
                }}
              >
                <small>{category}</small>
              </Button>
            ))}
          </Container>
          {search === "" ? (
            <div className="d-flex flex-wrap">
              {nearRestaurants.length > 0 ? (
                nearRestaurants.sort((a, b) => b.rating - a.rating).map(restaurant => <SingleRestaurantCard key={restaurant.idUser} restaurant={restaurant} deliveryLat={deliveryAddress.lat} deliveryLon={deliveryAddress.lon} />)
              ) : (
                <p className="mx-auto">No nearby restaurants found</p>
              )}
            </div>
          ) : (
            <div className="d-flex flex-wrap">
              {nearRestaurants
                .filter(product => product.name.toLowerCase().includes(search.toLowerCase()))
                .map((restaurant, index) => (
                  <SingleRestaurantCard key={index} restaurant={restaurant} deliveryLat={deliveryAddress.lat} deliveryLon={deliveryAddress.lon} />
                ))}
            </div>
          )}
        </div>
      </Container>
    </>
  );
};

export default LocalRestaurantsComponent;
