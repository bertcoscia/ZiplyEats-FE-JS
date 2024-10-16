import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import "./SingleProductComponent.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// TODO: IMPLEMENT CLOUDINARY

const SingleProductComponent = ({ product, userRole }) => {
  // ENV VARIABLES
  const ENV_VARIABLE = {
    URL_PRODUCTS: import.meta.env.VITE_PRODUCTS_URL
  };

  // HOOKS
  const navigate = useNavigate();

  // USE STATE
  const [show, setShow] = useState(false);
  const [editProductDTO, setEditProductDTO] = useState({
    name: product.name,
    price: product.price,
    description: product.description
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
    setEditProductDTO(prevState => ({
      ...prevState,
      [name]: normalizedValue
    }));
  };

  const handleSubmit = event => {
    event.preventDefault();
    editProduct(editProductDTO);
    handleClose();
  };

  // FETCH
  const editProduct = editProductDTO => {
    fetch(`${ENV_VARIABLE.URL_PRODUCTS}/my-products/${product.idProduct}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-type": "application/json"
      },
      body: JSON.stringify(editProductDTO)
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Unable to update the product. Please try again later.");
        }
      })
      .then(() => {
        setEditProductDTO({
          name: "",
          price: "",
          description: ""
        });
        navigate(0);
      })
      .catch(error => console.log(error));
  };

  return (
    <Col xs={10} sm={5} xl={3} className="perfect-shadow card justify-content-center mx-4 py-2 me-3 me-xl-5 mb-3 position-relative" style={{ height: "135px" }}>
      <Row>
        <Col xs={7} sm={6} md={8} xl={7}>
          <h5 className="card-title font-weight-bold mb-1 line-clamp-2">{product.name}</h5>
          <small className="card-text text-muted">{product.price.toFixed(2)} €</small>
        </Col>
        <Col xs={4} sm={5} md={3} xl={4}>
          <img src={product.imageUrl} alt={product.name} className="img-fluid rounded" style={{ width: "70px" }} />
        </Col>
        {userRole === "RESTAURANT" && (
          <Col xs={12} className="position-absolute bottom-0">
            <Button variant="link" className="p-0 text-decoration-none" onClick={handleShow}>
              <small>Edit</small>
            </Button>
          </Col>
        )}
        <Modal show={show} onHide={handleClose} className="perfect-shadow">
          <Modal.Header closeButton className="border-bottom-0"></Modal.Header>
          <Modal.Body>
            <h2 className="fs-5 text-center">Edit your product</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="signup__form__group mb-3">
                <Form.Label className="signup__form__group__label">Name</Form.Label>
                <Form.Control type="text" placeholder="Enter product name" value={editProductDTO.name} name="name" onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="signup__form__group mb-3">
                <Form.Label className="signup__form__group__label">Price</Form.Label>
                <Form.Control type="text" placeholder="Enter product price" value={editProductDTO.price} name="price" onChange={handleChange} />
              </Form.Group>
              <Form.Group className="signup__form__group mb-3">
                <Form.Label className="signup__form__group__label">Description</Form.Label>
                <Form.Control type="text" placeholder="Enter product description" value={editProductDTO.description} name="description" onChange={handleChange} required />
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
      </Row>
    </Col>
  );
};

export default SingleProductComponent;
