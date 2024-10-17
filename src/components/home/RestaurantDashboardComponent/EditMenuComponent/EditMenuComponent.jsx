import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import NavComponent from "../../../navbar/NavComponent";
import SingleProductComponent from "../../../SingleProductComponent/SingleProductComponent";
import { Button, Col, Container, Form, Modal, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// TODO: IMPLEMENT CLOUDINARY

const EditMenuComponent = () => {
  // ENV VARIABLES
  const ENV_VARIABLE = {
    URL_PRODUCTS: import.meta.env.VITE_PRODUCTS_URL
  };

  // HOOKS
  const profile = useSelector(state => state.profile.content);
  const navigate = useNavigate();

  // USE STATE
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [show, setShow] = useState(false);
  const [newProductDTO, setNewProductDTO] = useState({
    name: "",
    price: "",
    description: ""
  });

  // HANDLERS
  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleChange = event => {
    const { name, value } = event.target;
    const normalizedValue = value.replace(",", ".");
    setNewProductDTO(prevState => ({
      ...prevState,
      [name]: normalizedValue
    }));
  };

  const handleSubmit = event => {
    event.preventDefault();
    createNewProduct(newProductDTO);
    handleClose();
  };

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

  const createNewProduct = newProduct => {
    fetch(`${ENV_VARIABLE.URL_PRODUCTS}`, {
      method: "post",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-type": "application/json"
      },
      body: JSON.stringify(newProduct)
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Unable to create the new product. Please try again later.");
        }
      })
      .then(() => {
        setNewProductDTO({
          name: "",
          price: "",
          description: ""
        });
        navigate(0);
      })
      .catch(error => console.log(error));
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
              <Button variant="link" className="p-0 text-decoration-none ms-3 mb-3" onClick={handleShow}>
                <small>Add a new product</small>
              </Button>
              <Modal show={show} onHide={handleClose} className="perfect-shadow">
                <Modal.Header closeButton className="border-bottom-0"></Modal.Header>
                <Modal.Body>
                  <h2 className="fs-5 text-center">Edit your product</h2>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="signup__form__group mb-3">
                      <Form.Label className="signup__form__group__label">Name</Form.Label>
                      <Form.Control type="text" placeholder="Enter product name" value={newProductDTO.name} name="name" onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="signup__form__group mb-3">
                      <Form.Label className="signup__form__group__label">Price</Form.Label>
                      <Form.Control type="text" placeholder="Enter product price" value={newProductDTO.price} name="price" onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="signup__form__group mb-3">
                      <Form.Label className="signup__form__group__label">Description</Form.Label>
                      <Form.Control type="text" placeholder="Enter product description" value={newProductDTO.description} name="description" onChange={handleChange} required />
                    </Form.Group>
                    <Button type="submit" className="d-none">
                      Submit
                    </Button>
                  </Form>
                </Modal.Body>
                <Modal.Footer className="border-top-0 d-flex justify-content-center">
                  <Button type="button" onClick={handleSubmit} className="rounded-pill px-5 border-0">
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Modal>
              <Row className="d-flex justify-content-start">
                {menu.length > 0 ? menu.map((product, index) => <SingleProductComponent key={index} product={product} userRole={profile.userRole.userRole} fetch={getMyMenu} />) : <p>No products available</p>}
              </Row>
            </Container>
          )}
        </>
      )}
    </>
  );
};

export default EditMenuComponent;
