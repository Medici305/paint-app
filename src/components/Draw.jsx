import React, { useLayoutEffect, useState, useRef } from "react";
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
  // UseRef
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const colRef = useRef(null);
  // UseEffect
  // useEffect(() => {
  //   console.log(colRef);
  //   console.log(window.innerWidth);
  // }, [window.innerWidth, window.innerHeight]);
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
      className="d-flex justify-content-center bg-primary framer align-items-center text-center frame rounded"
      style={{ height: "80vh" }}
      ref={colRef}
    >
      <Col
        md={6}
        className="h-75 d-flex px-0 w-75 d-flex bg-success justify-content-center align-items-center border border-dark shadow"
        ref={colRef}
      >
        <canvas
          className="d-none bg-white border border-success my-5"
          width={window.innerWidth / 2}
          height={window.innerHeight / 1.45}
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

/*
  // UseState
  const [isDrawing, setIsDrawing] = useState(false);
  // UseRef
  const canvasRef = useRef(null);
  const colRef = useRef(null);
  const contextRef = useRef(null);
  // UseEffect
  useEffect(() => {
    const canvas = canvasRef.current;
    console.log(canvas);
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    console.log(canvas);

    const context = canvas.getContext("2d");
    context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 5;
    contextRef.current = context;
  }, []);
  // Functions
  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const stopDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };
  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };
*/
