import React from "react";
import { Navbar, Container, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaintRoller } from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink } from "react-router-dom";

const Nav = () => {
  return (
    <Navbar className="shadow-sm p-3 mb-5 bg-white rounded border-bottom">
      <Container>
        <NavLink to="/">
          <FontAwesomeIcon icon={faPaintRoller} className="mr-3" fa-pulse />
          <Navbar.Brand className="">Michelangelo</Navbar.Brand>
        </NavLink>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Link to="creative">
            <Button variant="outline-success">Create</Button>
          </Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Nav;
