import React, { useLayoutEffect, useState, useRef, useEffect } from "react";
import getStroke from "perfect-freehand";
import { Row, Col, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaintBrush,
  faSquare,
  faUndo,
  faRedo,
  faMinus,
  faSave,
  faHandPointer,
} from "@fortawesome/free-solid-svg-icons";
import rough from "roughjs/bundled/rough.esm";

const generator = rough.generator();

// Change color here.
const createElement = (id, x1, y1, x2, y2, type) => {
  switch (type) {
    case "line":
    case "rectangle":
      const roughElement =
        type === "line"
          ? generator.line(x1, y1, x2, y2)
          : generator.rectangle(x1, y1, x2 - x1, y2 - y1);
      return { id, x1, y1, x2, y2, type, roughElement };
    case "paint":
      return { id, type, points: [{ x: x1, y: y1 }] };
    default:
      throw new Error(`Type not recognised ${type}`);
  }
};

const nearPoint = (x, y, x1, y1, name) => {
  return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
};

const onLine = (x1, y1, x2, y2, x, y, maxDistance = 1) => {
  const a = { x: x1, y: y1 };
  const b = { x: x2, y: y2 };
  const c = { x, y };
  const offset = distance(a, b) - (distance(a, c) + distance(b, c));
  return Math.abs(offset) < maxDistance ? "inside" : null;
};

const isWithinElement = (x, y, element) => {
  const { type, x1, x2, y1, y2 } = element;
  switch (type) {
    case "line":
      const on = onLine(x1, y1, x2, y2, x, y);
      const start = nearPoint(x, y, x1, y1, "start");
      const end = nearPoint(x, y, x2, y2, "end");
      return start || end || on;
    case "rectangle":
      const topLeft = nearPoint(x, y, x1, y1, "tl");
      const topRight = nearPoint(x, y, x2, y1, "tr");
      const bottomLeft = nearPoint(x, y, x1, y2, "bl");
      const bottomRight = nearPoint(x, y, x2, y2, "br");
      const inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
      return topLeft || topRight || bottomLeft || bottomRight || inside;
    case "paint":
      const betweenAnyPoint = element.points.some((point, index) => {
        const nextPoint = element.points[index + 1];
        if (!nextPoint) return false;
        return (
          onLine(point.x, point.y, nextPoint.x, nextPoint.y, x, y, 5) != null
        );
      });
      return betweenAnyPoint ? "inside" : null;
    case "text":
      return x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
    default:
      throw new Error(`Type not recognised: ${type}`);
  }
};

const distance = (a, b) =>
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

const getElementAtPosition = (x, y, elements) => {
  return elements.find((element) => isWithinElement(x, y, element));
};

const cursorForPosition = (position) => {
  switch (position) {
    case "tl":
    case "br":
    case "start":
    case "end":
      return "nwse-resize";
    case "tr":
    case "bl":
      return "nesw-resize";
    default:
      return "move";
  }
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

const getSvgPathFromStroke = (stroke) => {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );

  d.push("Z");
  return d.join(" ");
};

const drawElement = (roughCanvas, context, element) => {
  switch (element.type) {
    case "line":
    case "rectangle":
      roughCanvas.draw(element.roughElement);
      break;
    case "paint":
      const stroke = getSvgPathFromStroke(getStroke(element.points));
      context.fill(new Path2D(stroke));
      break;
    default:
      throw new Error(`Type not recognised: ${element.type}`);
  }
};

const Draw = () => {
  // UseState
  const [elements, setelements, undo, redo] = useHistory([]);
  const [action, setAction] = useState("none");
  const [tool, setTool] = useState("paint");
  const [selectedElement, setSelectedElement] = useState(null);
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });
  // const [strokeColor, setStrokeColor] = useState("black");
  // const [fillColor, setFillColor] = useState("black");
  // const [lineWidth, setLineWidth] = useState(2);

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
    elements.forEach((element) => drawElement(roughCanvas, context, element));
  }, [elements]);

  // Functions
  const updateElement = (id, x1, y1, x2, y2, type) => {
    const elementsCopy = [...elements];
    switch (type) {
      case "line":
      case "rectangle":
        elementsCopy[id] = createElement(id, x1, y1, x2, y2, type);
        break;
      case "paint":
        elementsCopy[id].points = [
          ...elementsCopy[id].points,
          { x: x2, y: y2 },
        ];
        break;
      default:
        throw new Error(`Type not recognised: ${type}`);
    }
    setelements(elementsCopy, true);
  };

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    if (tool === "selection") {
      const element = getElementAtPosition(offsetX, offsetY, elements);
      if (element) {
        if (element.type === "paint") {
          const xOffsets = element.points.map((point) => offsetX - point.x);
          const yOffsets = element.points.map((point) => offsetY - point.y);
          setSelectedElement({ ...element, xOffsets, yOffsets });
        } else {
          const adjustedX = offsetX - element.x1;
          const adjustedY = offsetY - element.y1;
          setSelectedElement({ ...element, adjustedX, adjustedY });
        }
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

  const draw = ({ nativeEvent, target }) => {
    const { offsetX, offsetY } = nativeEvent;
    if (tool === "selection") {
      const element = getElementAtPosition(offsetX, offsetY, elements);
      target.style.cursor = element
        ? cursorForPosition(element.cursorForPosition)
        : "default";
    }
    if (action === "drawing") {
      const index = elements.length - 1;
      const { x1, y1 } = elements[index];
      updateElement(index, x1, y1, offsetX, offsetY, tool);
    } else if (action === "moving") {
      if (selectedElement.type === "paint") {
        const newPoints = selectedElement.points.map((_, index) => ({
          x: offsetX - selectedElement.xOffsets[index],
          y: offsetY - selectedElement.yOffsets[index],
        }));
        const elementsCopy = [...elements];
        elementsCopy[selectedElement.id].points = newPoints;
        setelements(elementsCopy, true);
      }
      const {
        id,
        x1,
        x2,
        y1,
        y2,
        type,
        adjustedX,
        adjustedY,
      } = selectedElement;
      const width = x2 - x1;
      const height = y2 - y1;
      const newX1 = offsetX - adjustedX;
      const newY1 = offsetY - adjustedY;
      updateElement(id, newX1, newY1, newX1 + width, newY1 + height, type);
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
          <Form.Group
            as={Row}
            className="mb-0 d-block border border-dark d-flex flex-column justify-content-center align-items-center"
          >
            <Form.Label as="legend" column className="text-underline">
              <h3>Tools</h3>
            </Form.Label>
            <Col
              sm={10}
              className="d-flex flex-column flex-lg-row justify-content-around align-items-around"
            >
              <Button
                variant="success"
                className="mb-2 mb-lg-0 px-lg-4"
                onClick={() => setTool("selection")}
              >
                {" "}
                <FontAwesomeIcon icon={faHandPointer} className="text-white" />
              </Button>
              <Button
                variant="success"
                className="my-2 my-lg-0 px-lg-4"
                onClick={() => setTool("paint")}
              >
                {" "}
                <FontAwesomeIcon icon={faPaintBrush} className="text-white" />
              </Button>
              <Button
                variant="success"
                className="my-2 my-lg-0 px-lg-4"
                onClick={() => setTool("line")}
              >
                {" "}
                <FontAwesomeIcon icon={faMinus} className="text-white" />
              </Button>
              <Button
                variant="success"
                className="my-2 my-lg-0 px-lg-4"
                onClick={() => setTool("rectangle")}
              >
                {" "}
                <FontAwesomeIcon icon={faSquare} className="text-white" />
              </Button>
              <Button
                variant="success"
                className="my-2 my-lg-0 px-lg-4"
                onClick={undo}
              >
                {" "}
                <FontAwesomeIcon icon={faUndo} className="text-white" />
              </Button>
              <Button
                variant="success"
                className="my-2 my-lg-0 px-lg-4"
                onClick={redo}
              >
                {" "}
                <FontAwesomeIcon icon={faRedo} className="text-white" />
              </Button>
              <Button
                variant="success"
                className="mt-2 mt-lg-0 px-lg-4"
                download={canvasRef}
              >
                {" "}
                <FontAwesomeIcon icon={faSave} className="text-white" />
              </Button>
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
