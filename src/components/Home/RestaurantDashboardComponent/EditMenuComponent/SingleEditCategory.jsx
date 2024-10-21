import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SingleEditCategory = ({ category }) => {
  // ENV VARIABLES
  const ENV_VARIABLE = {
    URL_PRODUCT_CATEGORIES: import.meta.env.VITE_PRODUCT_CATEGORIES_URL
  };

  // HOOKS
  const navigate = useNavigate();

  // USE STATE
  const [editCategory, setEditCategory] = useState({
    productCategory: category.productCategory
  });

  const [show, setShow] = useState(false);

  // HANDLERS
  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleChange = event => {
    const { name, value } = event.target;
    setEditCategory(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = event => {
    event.preventDefault();
    editProductCategory(editCategory);
  };

  // FETCH
  const editProductCategory = async editProductCategoryDTO => {
    try {
      const response = await fetch(`${ENV_VARIABLE.URL_PRODUCT_CATEGORIES}/my-product-categories/${category.idProductCategory}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-type": "application/json"
        },
        body: JSON.stringify(editProductCategoryDTO)
      });
      if (response.ok) {
        await response.json();
        navigate(0);
      } else {
        throw new Error("Could not edit product category");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Button className="category-button py-0 me-3 rounded-pill" onClick={handleShow}>
        <small>{category.productCategory}</small>
      </Button>
      <Modal show={show} onHide={handleClose} className="edit-menu__modal perfect-shadow">
        <Modal.Header closeButton className="border-bottom-0"></Modal.Header>
        <Modal.Body>
          <h2 className="edit-menu__modal-title fs-5 text-center">Edit your product category</h2>
          <Form onSubmit={handleSubmit} className="edit-menu__form">
            <Form.Group className="edit-menu__form-group mb-3">
              <Form.Label className="edit-menu__form-label">Name</Form.Label>
              <Form.Control type="text" placeholder="Enter product name" value={editCategory.productCategory} name="productCategory" onChange={handleChange} required className="edit-menu__form-input" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-top-0 d-flex justify-content-center">
          <Button variant="accent" type="button" onClick={handleSubmit} className="edit-menu__modal-save-button rounded-pill px-5 border-0">
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SingleEditCategory;
