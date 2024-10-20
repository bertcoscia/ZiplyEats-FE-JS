import { Alert, Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import "./SingleProductComponent.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Trash3 } from "react-bootstrap-icons";

const SingleProductComponent = ({ product, userRole, getMyMenu }) => {
  // ENV VARIABLES
  const ENV_VARIABLE = {
    URL_PRODUCTS: import.meta.env.VITE_PRODUCTS_URL
  };

  // HOOKS
  const navigate = useNavigate();

  // USE STATE
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editProductDTO, setEditProductDTO] = useState({
    name: product.name,
    price: product.price,
    description: product.description
  });
  const [img, setImg] = useState(null);

  // HANDLERS
  const handleShowEdit = () => {
    setShowEdit(true);
  };

  const handleShowEditClose = () => {
    setShowEdit(false);
  };

  const handleShowDelete = () => {
    setShowDelete(true);
  };

  const handleShowDeleteClose = () => {
    setShowDelete(false);
  };

  const handleChange = event => {
    const { name, value } = event.target;
    if (name === "price") {
      const normalizedValue = value.replace(",", ".");
      if (!isNaN(normalizedValue) && /^(\d+(\.\d{0,2})?)?$/.test(normalizedValue)) {
        setEditProductDTO(prevState => ({
          ...prevState,
          [name]: normalizedValue
        }));
      }
    } else {
      setEditProductDTO(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handlePicChange = event => {
    setImg(event.target.files[0]);
  };

  const handleSubmit = event => {
    event.preventDefault();
    editProduct(editProductDTO);
    handleShowEditClose();
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
        if (img !== null) {
          editProductImg(img);
        }
        navigate(0);
      })
      .catch(error => console.log(error));
  };

  const editProductImg = avatarFile => {
    const formData = new FormData();
    formData.append("avatar", avatarFile);
    fetch(`${ENV_VARIABLE.URL_PRODUCTS}/my-products/${product.idProduct}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      },
      body: formData
    })
      .then(response => {
        if (response.ok) {
          response.json();
        } else {
          throw new Error("Could not send data - @editProductImg");
        }
      })
      .then(() => {
        navigate(0);
      })
      .catch(error => console.log(error));
  };

  const deleteProduct = async () => {
    try {
      const response = await fetch(`${ENV_VARIABLE.URL_PRODUCTS}/my-products/${product.idProduct}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
      if (response.ok) {
        navigate(0);
        return await response.json();
      } else {
        throw new Error("Could not delete the selected product. Please try again");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Col
      xs={10}
      sm={5}
      xl={3}
      className="single-product single-product--shadow card justify-content-center mx-4 py-1 me-3 me-xl-5 mb-3 position-relative"
      style={{ height: "135px", cursor: "pointer" }}
      onClick={() => {
        if (userRole === "RESTAURANT") {
          handleShowEdit();
        }
      }}
    >
      <Row>
        <Col xs={7} sm={6} md={8} xl={7}>
          <small className="single-product__name fw-medium mb-1 line-clamp-2">{product.name}</small>
          <small className="single-product__price text-muted mb-1">{product.price.toFixed(2)} €</small>
          <small className="single-product__description card-text text-muted line-clamp-2" style={{ fontSize: "12px" }}>
            {product.description}
          </small>
        </Col>
        <Col xs={4} sm={5} md={3} xl={4}>
          <img src={product.imageUrl} alt={product.name} className="single-product__image rounded" style={{ width: "85px" }} />
        </Col>
        <Col xs={7} sm={6} md={8} xl={7}></Col>
        <Modal show={showEdit} onHide={handleShowEditClose} className="single-product__modal single-product--shadow" onClick={event => event.stopPropagation()}>
          <Modal.Header closeButton className="border-bottom-0" onClick={event => event.stopPropagation()} />
          <Modal.Body>
            <h2 className="fs-5 text-center">Edit your product</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="single-product__form-group mb-3">
                <Form.Label className="single-product__form-label">Name</Form.Label>
                <Form.Control type="text" placeholder="Enter product name" value={editProductDTO.name} name="name" onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="single-product__form-group mb-3">
                <Form.Label className="single-product__form-label">Price</Form.Label>
                <Form.Control type="text" placeholder="Enter product price" value={editProductDTO.price} name="price" onChange={handleChange} />
              </Form.Group>
              <Form.Group className="single-product__form-group mb-3">
                <Form.Label className="single-product__form-label">Description</Form.Label>
                <Form.Control type="text" placeholder="Enter product description" value={editProductDTO.description} name="description" onChange={handleChange} required />
              </Form.Group>
              <div className="d-flex justify-content-center">
                <img src={product.imageUrl} alt="" className="rounded" style={{ width: "85px" }} />
              </div>
              <Form.Group className="single-product__form-group mb-3">
                <Form.Label className="single-product__form-label">Product image</Form.Label>
                <Form.Control type="file" accept="img/*" onChange={handlePicChange} />
              </Form.Group>
              <Button type="submit" className="d-none">
                Submit
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer className="border-top-0 d-flex justify-content-center">
            <Button
              type="button"
              variant="danger"
              onClick={() => {
                handleShowEditClose();
                handleShowDelete();
              }}
              className="single-product__button single-product__button--delete rounded-pill px-5 border-0"
            >
              Delete
            </Button>
            <Button type="button" variant="accent" onClick={handleSubmit} className="single-product__button rounded-pill px-5 border-0">
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showDelete} onHide={handleShowDeleteClose} className="single-product__modal single-product--shadow">
          <Modal.Header closeButton className="border-bottom-0"></Modal.Header>
          <Modal.Body>
            <h4>Are you sure you want to delete this product?</h4>
          </Modal.Body>
          <Modal.Footer className="border-top-0 d-flex justify-content-center">
            <Button variant="accent" onClick={handleShowDeleteClose} className="single-product__button single-product__button--dismiss rounded-pill px-4 border-0">
              Dismiss
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                handleShowEditClose();
                deleteProduct();
              }}
              className="single-product__button rounded-pill px-4 border-0"
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </Row>
    </Col>
  );
};

export default SingleProductComponent;
