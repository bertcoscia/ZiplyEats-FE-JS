import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfileAction } from "../../redux/actions";
import { Button, Col, Container, Row } from "react-bootstrap";

const ProfileComponent = () => {
  const profile = useSelector(state => state.profile.content);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProfileAction());
  }, []);

  return (
    <>
      {profile && (
        <Container className="my-5">
          <h2>Account</h2>
          <Row className="my-4">
            <Col md={11} className="d-flex align-items-center">
              <span className="me-3">
                <img src="https://glovo.dhmedia.io/image/customer-assets-glovo/customer_profile/uds/person.svg?t=W3sic3ZnIjp7InEiOiJsb3cifX1d" alt="" style={{ width: "20px" }} />
              </span>
              <small>
                {profile.name} {profile.surname}
              </small>
            </Col>
            <Col md={1}>
              <Button variant="link" className="text-decoration-none edit__button__link">
                Edit
              </Button>
            </Col>
          </Row>
          <Row className="my-4">
            <Col md={11} className="d-flex align-items-center">
              <span className="me-3">
                <img src="https://glovo.dhmedia.io/image/customer-assets-glovo/customer_profile/mail.svg?t=W3sic3ZnIjp7InEiOiJsb3cifX1d" alt="" style={{ width: "20px" }} />
              </span>
              <small>{profile.email}</small>
            </Col>
            <Col md={1}>
              <Button variant="link" className="text-decoration-none edit__button__link">
                Edit
              </Button>
            </Col>
          </Row>
          <Row className="my-4">
            <Col md={11} className="d-flex align-items-center">
              <span className="me-3">
                <img src="https://glovo.dhmedia.io/image/customer-assets-glovo/customer_profile/lock.svg?t=W3sic3ZnIjp7InEiOiJsb3cifX1d" alt="" style={{ width: "20px" }} />
              </span>
              <small>Change password</small>
            </Col>
            <Col md={1}>
              <Button variant="link" className="text-decoration-none edit__button__link">
                Edit
              </Button>
            </Col>
          </Row>
          <Row className="my-4">
            <Col md={11} className="d-flex align-items-center">
              <span className="me-3">
                <img src="https://glovo.dhmedia.io/image/customer-assets-glovo/customer_profile/screen.svg?t=W3sic3ZnIjp7InEiOiJsb3cifX1d" alt="" style={{ width: "20px" }} />
              </span>
              <small>Change phone number</small>
            </Col>
            <Col md={1}>
              <Button variant="link" className="text-decoration-none edit__button__link">
                Edit
              </Button>
            </Col>
          </Row>
          <Row className="my-4">
            <Col md={11} className="d-flex align-items-center">
              <span className="me-3">
                <img src="https://glovo.dhmedia.io/image/customer-assets-glovo/customer_profile/payment.svg?t=W3sic3ZnIjp7InEiOiJsb3cifX1d" alt="" style={{ width: "20px" }} />
              </span>
              <small>Payment methods</small>
            </Col>
            <Col md={1}>
              <Button variant="link" className="text-decoration-none edit__button__link">
                Edit
              </Button>
            </Col>
          </Row>
          <Row className="my-4">
            <Col md={11} className="d-flex align-items-center">
              <span className="me-3">
                <img src="https://glovo.dhmedia.io/image/customer-assets-glovo/customer_profile/invoice.svg?t=W3sic3ZnIjp7InEiOiJsb3cifX1d" alt="" style={{ width: "20px" }} />
              </span>
              <small>Invoice information</small>
            </Col>
            <Col md={1}>
              <Button variant="link" className="text-decoration-none edit__button__link">
                Edit
              </Button>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default ProfileComponent;
