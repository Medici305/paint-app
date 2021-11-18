import React from "react";
import { Row, Col, ProgressBar } from "react-bootstrap";

const Construction = () => {
  return (
    <Row className="d-flex justify-content-center align-items-center text-center">
      <Col
        md={6}
        className="h-50 h-lg-25 d-flex flex-column justify-content-around align-items-center"
      >
        <h1>Page coming soon...</h1>
        <ProgressBar
          striped
          animated
          variant="success"
          now={65}
          key={1}
          className="w-75"
        />
      </Col>
    </Row>
  );
};

export default Construction;
