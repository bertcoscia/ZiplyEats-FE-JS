import { Alert, Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import "./SingleProductComponent.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Trash3 } from "react-bootstrap-icons";

const SingleProductComponent = ({ product, userRole, productCategories, getMyMenu, handleAddToCart, cart, toppings }) => {
  // ENV VARIABLES
  const ENV_VARIABLE = {
    URL_PRODUCTS: import.meta.env.VITE_PRODUCTS_URL
  };

  // HOOKS
  const navigate = useNavigate();

  // USE STATE
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showAddToCart, setShowAddToCart] = useState(false);
  const [editProductDTO, setEditProductDTO] = useState({
    name: product.name,
    price: product.price,
    description: product.description,
    productCategory: product.productCategory.productCategory,
    canHaveToppings: product.canHaveToppings
  });
  const [img, setImg] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isProductInCart, setIsProductInCart] = useState(false);
  const [selectedToppings, setSelectedToppings] = useState([]);

  // HANDLERS
  const handleShowEdit = () => {
    setShowEdit(true);
  };

  const handleCloseEdit = () => {
    setShowEdit(false);
  };

  const handleShowDelete = () => {
    setShowDelete(true);
  };

  const handleCloseDelete = () => {
    setShowDelete(false);
  };

  const handleShowAddToCart = () => {
    setQuantity(1);
    const isInCart = cart.some(item => item.idProduct === product.idProduct);
    setIsProductInCart(isInCart);
    setShowAddToCart(true);
  };

  const handleCloseAddToCart = () => {
    setShowAddToCart(false);
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

  const handleCheckboxChange = () => {
    setEditProductDTO(prevState => ({
      ...prevState,
      canHaveToppings: !prevState.canHaveToppings
    }));
  };

  const handlePicChange = event => {
    setImg(event.target.files[0]);
  };

  const handleSubmit = event => {
    event.preventDefault();
    editProduct(editProductDTO);
    handleCloseEdit();
  };

  const handleIncrease = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const handleDecrease = () => {
    setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1)); // Non permettiamo meno di 1
  };

  const handleAddTopping = (event, topping) => {
    const { checked } = event.target;

    if (checked) {
      setSelectedToppings(prevState => [...prevState, topping]);
    } else {
      setSelectedToppings(prevState => prevState.filter(topping => topping.idProduct !== topping.idProduct));
    }
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
          description: "",
          canHaveToppings: false
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
        } else if (userRole === "USER") {
          handleShowAddToCart();
        }
      }}
    >
      <Row>
        <Col xs={7} sm={6} md={8} xl={7}>
          <small className="single-product__name fw-medium mb-1 line-clamp d-block" style={{ fontSize: "12px" }}>
            {product.name}
          </small>
          <small className="single-product__price text-muted mb-1 d-block pb-auto" style={{ fontSize: "10px" }}>
            {product.price.toFixed(2)} €
          </small>
          {userRole === "RESTAURANT" && product.productCategory.productCategory && (
            <small className="single-product__price text-muted mb-1 fst-italic d-block" style={{ fontSize: "10px" }}>
              {product.productCategory.productCategory}
            </small>
          )}
          <small className="single-product__description card-text text-muted line-clamp" style={{ fontSize: "10px" }}>
            {product.description}
          </small>
        </Col>
        {product.imageUrl && (
          <Col xs={4} sm={5} md={3} xl={4}>
            <img src={product.imageUrl} alt={product.name} className="single-product__image rounded" style={{ width: "85px", height: "" }} />
          </Col>
        )}
        <Col xs={7} sm={6} md={8} xl={7}></Col>

        {/* MODAL EDIT */}
        <Modal show={showEdit} onHide={handleCloseEdit} className="single-product__modal single-product--shadow" onClick={event => event.stopPropagation()}>
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
              {productCategories && (
                <Form.Group className="edit-menu__form-group mb-3">
                  <Form.Label className="edit-menu__form-label">Product category</Form.Label>
                  <Form.Select name="productCategory" value={editProductDTO.productCategory} onChange={handleChange}>
                    {productCategories.map((category, index) => (
                      <option key={index} value={category.productCategory}>
                        {category.productCategory}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              )}
              <Form.Group className="single-product__form-group mb-3">
                <Form.Check type="checkbox" label="Can have toppings" name="canHaveToppings" checked={editProductDTO.canHaveToppings} onChange={handleCheckboxChange} />
              </Form.Group>
              <div className="d-flex justify-content-center">
                <img src={product.imageUrl} alt="" className="rounded" style={{ width: "85px" }} />
              </div>
              <Form.Group className="single-product__form-group mb-3">
                <Form.Label className="single-product__form-label">Product image</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handlePicChange} />
              </Form.Group>
              <Button variant="accent" type="submit" className="d-none">
                Submit
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer className="border-top-0 d-flex justify-content-center">
            <Button
              variant="danger"
              onClick={() => {
                handleCloseDelete();
                deleteProduct();
              }}
              className="single-product__button rounded-pill px-4 border-0"
            >
              Delete
            </Button>
            <Button type="button" variant="accent" onClick={handleSubmit} className="single-product__button px-5 border-0">
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showDelete} onHide={handleCloseDelete} className="single-product__modal single-product--shadow">
          <Modal.Header closeButton className="border-bottom-0"></Modal.Header>
          <Modal.Body>
            <h4>Are you sure you want to delete this product?</h4>
          </Modal.Body>
          <Modal.Footer className="border-top-0 d-flex justify-content-center">
            <Button variant="accent" onClick={handleCloseDelete} className="single-product__button single-product__button--dismiss rounded-pill px-4 border-0">
              Dismiss
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                handleCloseEdit();
                deleteProduct();
              }}
              className="single-product__button rounded-pill px-4 border-0"
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        {/* MODAL ADD TO BASKET */}
        <Modal show={showAddToCart} onHide={handleCloseAddToCart} className="single-product__modal single-product--shadow" onClick={event => event.stopPropagation()}>
          <Modal.Header closeButton onClick={handleCloseAddToCart} className="border-bottom-0" onClick={event => event.stopPropagation()}></Modal.Header>
          <Modal.Body className="d-flex flex-column">
            <div className="d-flex align-items-center">
              <div className="me-auto">
                <h4>{product.name}</h4>
                <small className="fst-italic">{product.description}</small>
              </div>
              <img src={product.imageUrl} alt="" className="rounded" style={{ width: "120px" }} />
            </div>

            <div className="d-flex justify-content-center align-items-center mt-3">
              <Button variant="outline-secondary" onClick={handleDecrease} className="px-3" style={{ fontSize: "1.2rem" }}>
                -
              </Button>
              <span className="mx-3" style={{ fontSize: "1.2rem" }}>
                {quantity}
              </span>
              <Button variant="outline-secondary" onClick={handleIncrease} className="px-3" style={{ fontSize: "1.2rem" }}>
                +
              </Button>
            </div>
            <div className="d-flex flex-column my-3">
              {product.canHaveToppings && toppings && (
                <>
                  <h5>Toppings</h5>
                  {toppings.map(topping => (
                    <div key={topping.idProduct} className="d-flex justify-content-between my-1">
                      <Form>
                        <Form.Group className="single-product__form-group mb-3">
                          <Form.Check type="checkbox" label={topping.name} name="canHaveToppings" onChange={event => handleAddTopping(event, topping)} className="single-topping__checkbox-label--small" />
                        </Form.Group>
                      </Form>
                      <small className="text-muted fst-italic">+{topping.price.toFixed(2)}€</small>
                    </div>
                  ))}
                </>
              )}
            </div>
          </Modal.Body>

          <Modal.Footer className="border-top-0 d-flex justify-content-center">
            <Button
              variant="accent"
              onClick={() => {
                handleAddToCart(product, quantity, selectedToppings);
                handleCloseAddToCart();
              }}
              className="single-product__button rounded-pill px-4 border-0"
            >
              Add {quantity} for {((product.price + selectedToppings.reduce((acc, topping) => acc + topping.price, 0)) * quantity).toFixed(2)}€
            </Button>
          </Modal.Footer>
        </Modal>
      </Row>
    </Col>
  );
};

export default SingleProductComponent;
