import React, { useLayoutEffect, useState, useRef, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import rough from "roughjs/bundled/rough.esm";

const generator = rough.generator();

const createElement = (x1, y1, x2, y2) => {
  const roughElement = generator.line(x1, y1, x2, y2);
  return { x1, y1, x2, y2, roughElement };
};

const Draw = () => {
  // UseState
  const [element, setElement] = useState([]);
  const [drawing, setDrawing] = useState(false);
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
    element.forEach(({ roughElement }) => roughCanvas.draw(roughElement));
  }, [element]);
  // Functions
  const startDrawing = ({ nativeEvent }) => {
    setDrawing(true);
    const { offsetX, offsetY } = nativeEvent;

    const element = createElement(offsetX, offsetY, offsetX, offsetY);
    setElement((prevState) => [...prevState, element]);
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
    if (!drawing) return;
    const { offsetX, offsetY } = nativeEvent;
    const index = element.length - 1;
    const { x1, y1 } = element[index];
    const updatedElement = createElement(x1, y1, offsetX, offsetY);

    const elementsCopy = [...element];
    elementsCopy[index] = updatedElement;
    setElement(elementsCopy);
  };
  return (
    <Row
      className="d-flex justify-content-center frame align-items-center text-center frame rounded"
      style={{ height: "80vh" }}
      ref={colRef}
    >
      <Col
        md={6}
        className="h-75 d-flex px-0 w-75 d-flex justify-content-center align-items-center"
        ref={colRef}
      >
        <canvas
          className="bg-white border border-dark shadow rounded my-5"
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
    </Row>
  );
};

export default Draw;