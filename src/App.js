import React from "react";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Nav from "./components/Nav";
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/creative" element={<Create />} />
      </Routes>
    </>
  );
};

export default App;
