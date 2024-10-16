import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import NavComponent from "../../../navbar/NavComponent";
import SingleProductComponent from "../../../SingleProductComponent/SingleProductComponent";
import { Container, Row, Spinner } from "react-bootstrap";

const EditMenuComponent = () => {
  // ENV VARIABLES
  const ENV_VARIABLE = {
    URL_PRODUCTS: import.meta.env.VITE_PRODUCTS_URL
  };

  // HOOKS
  const profile = useSelector(state => state.profile.content);

  // USE STATE
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileLoaded, setProfileLoaded] = useState(false);

  // FETCH
  const getMyMenu = () => {
    if (!profile?.idUser) {
      return;
    }

    fetch(`${ENV_VARIABLE.URL_PRODUCTS}/${profile.idUser}/products`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Could not retrieve menu - @getMyMenu");
        }
      })
      .then(data => {
        setMenu(data.content);
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
      });
  };

  // USE EFFECT
  useEffect(() => {
    if (profile?.idUser) {
      setProfileLoaded(true);
    }
  }, [profile]);

  // USE EFFECT
  useEffect(() => {
    if (profileLoaded) {
      getMyMenu();
    }
  }, [profileLoaded]);

  return (
    <>
      <NavComponent />

      {!profileLoaded ? (
        <Spinner />
      ) : (
        <>
          {loading && <p>Loading menu...</p>}

          {!loading && (
            <Container style={{ marginTop: "100px" }}>
              <Row className="d-flex justify-content-start">{menu.length > 0 ? menu.map((product, index) => <SingleProductComponent key={index} product={product} userRole={profile.userRole.userRole} />) : <p>No products available</p>}</Row>
            </Container>
          )}
        </>
      )}
    </>
  );
};

export default EditMenuComponent;
