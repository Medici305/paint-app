import React from "react";
import Poster from "./Poster";
import { Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <Row
      className="d-flex justify-content-around mt-4"
      style={{ height: "80vh" }}
    >
      <Col
        xs={12}
        lg={5}
        className=" d-flex flex-column justify-content-center order-2 order-lg-1"
      >
        <h1 className="font-weight-bold text-center text-lg-left">
          Create a new space for your project
        </h1>
        <p className="my-lg-5 my-4 text-center">
          Doodle. We all do it sometimes on the borders of the notebooks but if
          you'd take some more time and a blank page you could create a mandala
          or just a beautiful design.
        </p>
        <Link to="/creative">
          {" "}
          <Button variant="outline-success" size="lg" className="w-100">
            Create
          </Button>
        </Link>
      </Col>
      <Col
        xs={12}
        lg={6}
        className="order-1 order-lg-2 d-flex justify-item-center align-items-center mb-lg-0 mb-5"
      >
        <Poster />
      </Col>
    </Row>
  );
};

export default Banner;

// Being creative doesn’t require a lot of time and talent,
