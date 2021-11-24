import React from "react";
import { Col } from "react-bootstrap";

const Footer = () => {
  return (
    <div
      className="bg-white py-2 d-flex align-items-center border-top"
      style={{ height: "10vh" }}
    >
      <Col className="d-flex justify-content-end align-items-center">
        <p>Copyright © Michelangelo 2021 </p>
      </Col>
    </div>
  );
};

export default Footer;
