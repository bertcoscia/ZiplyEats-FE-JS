import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import NavComponent from "../NavComponent/NavComponent";
import { Button, Container } from "react-bootstrap";
import { StarFill } from "react-bootstrap-icons";

const RestaurantComponent = () => {
  // ENV VARIABLES
  const ENV_VARIABLES = {
    URL_RESTAURANTS: import.meta.env.VITE_RESTAURANTS_URL
  };

  // HOOKS
  const idRestaurant = useParams();
  const navigate = useNavigate();

  // USE STATE
  const [restaurant, setRestaurant] = useState(null);

  // FETCH
  const getRestaurant = async id => {
    try {
      const response = await fetch(`${ENV_VARIABLES.URL_RESTAURANTS}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
      if (response.ok) {
        setRestaurant(await response.json());
      } else {
        throw new Error("Could not get restaurant");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // USE EFFECT
  useEffect(() => {
    getRestaurant(idRestaurant.id);
  }, []);
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
        </div>
      )}
    </>
  );
};

export default RestaurantComponent;
