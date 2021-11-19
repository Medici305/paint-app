import React from "react";
import { Container } from "react-bootstrap";
import Banner from "../components/Banner";
import Team from "../components/Team";

const Home = () => {
  return (
    <Container>
      <Banner />
      <Team />
    </Container>
  );
};

export default Home;
