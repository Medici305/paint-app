import React, { useLayoutEffect, useState, useRef, useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";
import rough from "roughjs/bundled/rough.esm";

const generator = rough.generator();

const createElement = (id, x1, y1, x2, y2, type) => {
  const roughElement =
    type === "line"
      ? generator.line(x1, y1, x2, y2)
      : generator.rectangle(x1, y1, x2 - x1, y2 - y1);
  return { id, x1, y1, x2, y2, type, roughElement };
};

const isWithinElement = (x, y, element) => {
  const { type, x1, x2, y1, y2 } = element;
  if (type === "rectangle") {
    // Check if we are within the max of x and min of x. vice versa for y axis.
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    return x >= minX && x <= maxX && minY && y <= maxY;
  } else {
    // Full length of line is from A to B. We find the distance of A to B minus (A to c) + (C to B). Should equal to zero for it to be true
    const a = { x: x1, y: y1 };
    const b = { x: x2, y: y2 };
    const c = { x, y };
    const offset = distance(a, b) - (distance(a, c) + distance(b, c));
    return Math.abs(offset) < 1;
  }
};

const distance = (a, b) =>
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

const getElementAtPosition = (x, y, elements) => {
  return elements.find((element) => isWithinElement(x, y, element));
};

const useHistory = (initialState) => {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState([initialState]);
  const setState = (action, overwrite = false) => {
    const newState =
      typeof action === "function" ? action(history[index]) : action;
    if (overwrite) {
      const historyCopy = [...history];
      historyCopy[index] = newState;
      setHistory(historyCopy);
    } else {
      const updatedState = [...history.slice(0, index + 1)];
      setHistory((prevState) => [...updatedState, newState]);
      setIndex((prevState) => prevState + 1);
    }
  };

  const undo = () => index > 0 && setIndex((prevState) => prevState - 1);
  const redo = () =>
    index < history.length - 1 && setIndex((prevState) => prevState + 1);

  return [history[index], setState, undo, redo];
};

const Draw = () => {
  // UseState
  const [elements, setelements, undo, redo] = useHistory([]);
  const [action, setAction] = useState("none");
  const [tool, setTool] = useState("line");
  const [selectedElement, setSelectedElement] = useState(null);
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  // UseRef
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const colRef = useRef(null);
  useEffect(() => {
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth / 1.57,
        height: window.innerHeight / 1.69,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // UseLayoutEffect
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    contextRef.current = context;
    const roughCanvas = rough.canvas(canvas);
    elements.forEach(({ roughElement }) => roughCanvas.draw(roughElement));
  }, [elements]);

  // Functions
  const updateElement = (id, x1, y1, x2, y2, type) => {
    const updatedElement = createElement(id, x1, y1, x2, y2, type);

    const elementsCopy = [...elements];
    elementsCopy[id] = updatedElement;
    setelements(elementsCopy, true);
  };

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    if (tool === "selection") {
      const element = getElementAtPosition(offsetX, offsetY, elements);
      if (element) {
        const adjustedX = offsetX - element.x1;
        const adjustedY = offsetY - element.y1;
        setSelectedElement({ ...element, adjustedX, adjustedY });
        setelements((prevState) => prevState);
        setAction("moving");
      }
    } else {
      const id = elements.length;
      const element = createElement(
        id,
        offsetX,
        offsetY,
        offsetX,
        offsetY,
        tool
      );
      setelements((prevState) => [...prevState, element]);
      setAction("drawing");
    }
  };

  const stopDrawing = () => {
    setAction("none");
    setSelectedElement(null);
  };

  const draw = ({ nativeEvent, event }) => {
    const { offsetX, offsetY } = nativeEvent;
    if (action === "selection") {
      event.target.style.cursor = getElementAtPosition(
        offsetX,
        offsetY,
        elements
      )
        ? "move"
        : "default";
    }
    if (action === "drawing") {
      const index = elements.length - 1;
      const { x1, y1 } = elements[index];
      updateElement(index, x1, y1, offsetX, offsetY, tool);
    } else if (action === "moving") {
      const { id, x1, x2, y1, y2, adjustedX, adjustedY } = selectedElement;
      const width = x2 - x1;
      const height = y2 - y1;
      const newX1 = offsetX - adjustedX;
      const newY1 = offsetY - adjustedY;
      updateElement(id, newX1, newY1, newX1 + width, newY1 + height, tool);
    }
  };
  return (
    <Row
      className="d-flex flex-column flex-lg-row justify-content-around frame align-items-center text-center frame rounded pb-5"
      style={{ height: "auto" }}
      ref={colRef}
    >
      <Col
        md={6}
        className="h-75 d-flex px-0 w-75 d-flex justify-content-center align-items-center"
        ref={colRef}
      >
        <canvas
          className="bg-white shadow rounded my-5"
          width={windowSize.width}
          height={windowSize.height}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          ref={canvasRef}
        >
          Canvas
        </canvas>
      </Col>
      <Col
        xs={8}
        className="bg-white rounded shadow h-75 d-flex justify-content-center align-items-center"
      >
        {" "}
        <fieldset className="w-100">
          <Form.Group as={Row} className="mb-0 d-block border border-dark">
            <Form.Label as="legend" column className="text-underline">
              Tools
            </Form.Label>
            <Col
              sm={10}
              className="d-flex flex-column justify-content-center align-items-start"
            >
              <Form.Check
                type="radio"
                label="Selection"
                name="selection"
                checked={tool === "selection"}
                onChange={() => setTool("selection")}
              />
              <Form.Check
                type="radio"
                label="Line"
                name="line"
                checked={tool === "line"}
                onChange={() => setTool("line")}
              />
              <Form.Check
                type="radio"
                label="Rectangle"
                name="rectangle"
                checked={tool === "rectangle"}
                onChange={() => setTool("rectangle")}
              />
              <button onClick={undo}>Undo</button>
              <button onClick={redo}>Redo</button>
            </Col>
          </Form.Group>
        </fieldset>
      </Col>
    </Row>
  );
};

export default Draw;

/**
 * , {
          fill: "red",
          fillStyle: "solid",
          hachureAngle: 60,
          hachureGap: 8,
        } 
 * 
 */

/*
          2. Ability to move item when selected.
          -  Using the action state define in the mouse down/up and draw functions when to set state to drawing run draw login and when state set to selection no drawing should take place.
          - Do some mathematics within a function to return boolean wether the area we selected is within the element. Different formulas for line and rectangle.
          - 
        */
