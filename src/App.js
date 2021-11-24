import React from "react";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

const App = () => {
  const location = useLocation();
  const { pathname } = location;
  return (
    <>
      <Nav />
      <AnimatePresence exitBeforeEnter>
        <Routes location={location} key={pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/creative" element={<Create />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  );
};

export default App;
