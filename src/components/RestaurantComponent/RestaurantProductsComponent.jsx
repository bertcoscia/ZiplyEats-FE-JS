import { Button, Container, Row } from "react-bootstrap";
import SingleProductComponent from "../SingleProductComponent/SingleProductComponent";
import { useSelector } from "react-redux";

const RestaurantProductsComponent = ({ products, productCategories, handleAddToCart, cart, toppings }) => {
  // HOOKS
  const profile = useSelector(state => state.profile.content);

  return (
    <Container className="restaurant-products-component">
      <div className="d-flex flex-wrap mb-3">
        {productCategories.map((category, index) => (
          <Button
            key={index}
            className="category-button py-0 me-3 rounded-pill"
            onClick={() => {
              const categoryElement = document.getElementById(category);
              if (categoryElement) {
                categoryElement.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            <small>{category}</small>
          </Button>
        ))}
      </div>
      <div className="d-flex flex-wrap">
        {productCategories.map(category => (
          <div key={category} id={category}>
            <h3 className="mb-3">{category}</h3>
            <Row className="d-flex flex-wrap">
              {products
                .filter(product => product.productCategory.productCategory === category)
                .map(product => (
                  <SingleProductComponent key={product.idProduct} product={product} userRole={profile.userRole.userRole} handleAddToCart={handleAddToCart} cart={cart} toppings={toppings} />
                ))}
            </Row>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default RestaurantProductsComponent;
