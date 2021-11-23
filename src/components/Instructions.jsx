import React from "react";
import { Row, Col } from "react-bootstrap";
import step1 from "../images/instruct-1.webp";
import step2 from "../images/instruct-2.webp";
import step3 from "../images/instruct-3.webp";

const Instructions = () => {
  return (
    <Row className=" text-center" style={{ height: "auto" }}>
      <h1 className=" h-25 font-weight-bold mb-5">This is how it works!</h1>
      <Col
        xs={12}
        className=" d-flex justify-content-around align-items-center"
      >
        <img src={step1} alt="step-1" className="steps  shadow" roundedCircle />
        <div className="d-flex flex-column justify-content-center align-items-center">
          <h3>Select your tool</h3>
          <p className="w-50 ">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis unde
            quam minima ipsum, aperiam vero.
          </p>
        </div>
      </Col>
      <Col
        xs={12}
        className=" d-flex my-5 justify-content-around align-items-center"
      >
        <div className="d-flex flex-column justify-content-center align-items-center">
          <h3>Move your shape</h3>
          <p className="w-50 ">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis unde
            quam minima ipsum, aperiam vero.
          </p>
        </div>
        <img src={step2} alt="step-2" className="steps  shadow" roundedCircle />
      </Col>
      <Col
        xs={12}
        className=" d-flex justify-content-around align-items-center"
      >
        <img src={step3} alt="step-3" className="steps  shadow" roundedCircle />
        <div className="d-flex flex-column justify-content-center align-items-center">
          <h3>Undo and Erase</h3>
          <p className="w-50 ">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis unde
            quam minima ipsum, aperiam vero.
          </p>
        </div>
      </Col>
    </Row>
  );
};

export default Instructions;
