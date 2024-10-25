import { Col, Row } from "react-bootstrap";
import { StarFill } from "react-bootstrap-icons";
import "./SingleRestaurantComponent.css";
import { useNavigate } from "react-router-dom";

const SingleRestaurantCard = ({ restaurant }) => {
  // HOOKS
  const navigate = useNavigate();

  return (
    <Col
      xs={10}
      sm={5}
      xl={3}
      className="single-restaurant single-restaurant--shadow card mx-4 me-3 me-xl-5 mb-3 position-relative"
      style={{ cursor: "pointer" }}
      onClick={() => {
        navigate(`/restaurant/${restaurant.idUser}`);
      }}
    >
      <Row>
        <Col xs={4} sm={5} md={4} xl={4}>
          <img src={restaurant.avatarUrl} alt={restaurant.name} className="single-restaurant__image rounded-start" style={{ width: "85px" }} />
        </Col>
        <Col xs={7} sm={6} md={8} xl={7} className="pt-3">
          <small className="single-restaurant__name fw-medium mb-1 line-clamp">{restaurant.name}</small>
          <small className="d-flex align-items-center mt-2">
            <StarFill fill="#f9c90b" className="me-1" width={"24px"} />
            <small>{restaurant.rating.toFixed(1)}</small>
          </small>
        </Col>
      </Row>
    </Col>
  );
};

export default SingleRestaurantCard;
