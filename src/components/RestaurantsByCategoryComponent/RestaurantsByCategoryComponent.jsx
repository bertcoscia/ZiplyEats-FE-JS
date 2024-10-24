import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavComponent from "../NavComponent/NavComponent";
import { Button, Container, Form } from "react-bootstrap";
import SingleRestaurantCard from "../SingleRestaurantComponent/SingleRestaurantCard";

const RestaurantsByCategoryComponent = () => {
  // ENV VARIABLES
  const ENV_VARIABLES = {
    URL_RESTAURANTS: import.meta.env.VITE_RESTAURANTS_URL,
    GEOAPIFY_KEY: import.meta.env.VITE_GEOAPIFY_KEY
  };

  // HOOKS
  const params = useParams();
  const deliveryAddress = JSON.parse(sessionStorage.getItem("deliveryAddress"));
  const navigate = useNavigate();

  // USE STATE
  const [restaurants, setRestaurants] = useState([]);
  const [nearRestaurants, setNearRestaurants] = useState([]);
  const [search, setSearch] = useState("");

  // HANDLERS
  const handleSearchChange = event => {
    setSearch(event.target.value);
  };

  // FETCH
  const findRestaurantsByCategory = async category => {
    try {
      const response = await fetch(`${ENV_VARIABLES.URL_RESTAURANTS}/find-category/${category}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setRestaurants(data.content);
      } else {
        throw new Error("Could not find restaurants by category");
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
  const resetSearch = () => {
    setSearch("");
  };

  // USE EFFECT
  useEffect(() => {
    findRestaurantsByCategory(params.category);
  }, [params.category]);

  useEffect(() => {
    if (restaurants.length > 0) {
      restaurants.forEach(restaurant => filterByDistance(restaurant));
    }
  }, [restaurants]);

  return (
    <>
      <NavComponent />
      <Container style={{ marginTop: "80px" }}>
        <h1 className="text-center pt-3">Top {params.category.toLocaleLowerCase()} restaurants in your area</h1>
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
        {search === "" ? (
          <div className="d-flex justify-content-around flex-wrap my-3">
            {nearRestaurants.length > 0 ? nearRestaurants.sort((a, b) => b.rating - a.rating).map(restaurant => <SingleRestaurantCard key={restaurant.idUser} restaurant={restaurant} />) : <p>No nearby restaurants found</p>}
          </div>
        ) : (
          <div className="d-flex flex-wrap">
            {nearRestaurants
              .filter(product => product.name.toLowerCase().includes(search.toLowerCase()))
              .map((restaurant, index) => (
                <SingleRestaurantCard key={index} restaurant={restaurant} />
              ))}
          </div>
        )}
      </Container>
    </>
  );
};

export default RestaurantsByCategoryComponent;
