import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import profile from "../images/profile.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin, faTwitter } from "@fortawesome/free-brands-svg-icons";

const Team = () => {
  return (
    <Row
      className="d-flex flex-column justify-content-center align-items-end"
      style={{ height: "auto" }}
    >
      <div className="text-center d-flex flex-column justify-content-center align-items-center mb-5">
        <h1 className="font-weight-bold">Meet Our Founder - Julien</h1>
        <p className="w-75 mt-2">
          From a startup to a market leader! Together, they translated their
          vision into an innovative app that helps you manage your workflow
          efficiently and do more what matters the most.
        </p>
      </div>
      <Col className="h-75 d-flex justify-content-center align-items-end">
        {" "}
        <Card className="text-center border-success shadow pt-3 rounded" style={{ width: "28rem" }}>
          <Card.Img
            variant="top"
            src={profile}
            roundedCircle
            className="roundedCirle"
          />
          <Card.Body>
            <Card.Title>Front-End Developer</Card.Title>
            <Card.Text>
              Front-End Developer focused on crafting clean and user-friendly
              experience. I'm extremely passionate about web development. Coding
              for me is more than knowledge, it helps me to express my
              creativity and potential. I truly love what I do, as every day
              there is something new and exciting to learn.
            </Card.Text>
            <hr />
            <div className="social d-flex justify-content-around align-items-center">
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.linkedin.com/in/julien-o-841570190/"
              >
                <FontAwesomeIcon
                  icon={faLinkedin}
                  size="2x"
                  className="mr-3 text-success fa-beat"
                />
              </a>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://twitter.com/ProgrammingThug"
              >
                <FontAwesomeIcon
                  icon={faTwitter}
                  size="2x"
                  className="mr-3 text-success"
                />
              </a>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://juliens-portfolio.netlify.app/"
              >
                <FontAwesomeIcon
                  size="2x"
                  icon={faLink}
                  className="mr-3 text-success"
                />
              </a>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Team;
