import React from "react";
import { Container } from "react-bootstrap";
import Banner from "../components/Banner";
import Instructions from "../components/Instructions";
import Team from "../components/Team";
import { motion } from "framer-motion";
import { pageAnim } from "../animation";

const Home = () => {
  return (
    <motion.div variants={pageAnim} exit="exit" initial="hidden" animate="show">
      <Container className="">
        <Banner />
        <Instructions />
        <Team />
      </Container>
    </motion.div>
  );
};

export default Home;
