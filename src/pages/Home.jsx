import React from "react";
import { Container } from "react-bootstrap";
import Banner from "../components/Banner";
import Instructions from "../components/Instructions";
import Team from "../components/Team";

const Home = () => {
  return (
    <Container>
      <Banner />
      <Instructions />
      <Team />
    </Container>
  );
};

export default Home;
