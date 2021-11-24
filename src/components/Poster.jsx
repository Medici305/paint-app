import React from "react";
import { Carousel } from "react-bootstrap";
import bg_1 from "../images/girl-1.webp";
import bg_2 from "../images/girl-2.webp";
import bg_3 from "../images/girl-3.webp";

const Poster = () => {
  return (
    <Carousel
      fade
      variant="dark"
    >
      <Carousel.Item>
        <img className="d-block w-100" src={bg_1} alt="girl-one" />
      </Carousel.Item>
      <Carousel.Item>
        <img className="d-block w-100" src={bg_2} alt="girl-two" />
      </Carousel.Item>
      <Carousel.Item>
        <img className="d-block w-100" src={bg_3} alt="girl_3" />
      </Carousel.Item>
    </Carousel>
  );
};

export default Poster;
