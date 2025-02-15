import React, { useCallback, useEffect } from "react";

//Helper function to update selectedElements state
export const handleColorClick = (elementId, color, setSelectedElements) => {
  setSelectedElements((prev) => ({ ...prev, [elementId]: color }));
};

//Base Template that will handle the coloring logic
const BaseTemplate = ({
  children,
  selectedElements,
  width = 400,
  height = 300,
  className,
  onClick,
}) => {
  //Apply colors on selected Elements (Runs on every re-render)
  useEffect(() => {
    //Loop through our selected elements object
    for (const elementId in selectedElements) {
      //Get the element by id
      const element = document.getElementById(elementId);
      //If element exists apply the color to it
      if (element) {
        element.style.fill = selectedElements[elementId];
      }
    }
  }, [selectedElements]);

  //Svg click handler, finds the target id and calls our onClick
  const handleSvgClick = useCallback(
    (event) => {
      //get the target id
      const elementId = event.target.id;
      //if the id exists call the onClick
      if (elementId) {
        onClick(elementId);
      }
    },
    [onClick]
  );

  return (
    <svg
      onClick={handleSvgClick}
      width={width}
      height={height}
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
};

//Template function for creating the Car
const CarTemplate = ({
  onClick,
  selectedElements,
  width = 400,
  height = 300,
  className,
}) => {
  return (
    <BaseTemplate
      onClick={onClick}
      selectedElements={selectedElements}
      width={width}
      height={height}
      className={className}
    >
      {/* Car Body */}
      <path
        id="car-body"
        d="M50 150 L100 150 C150 150 200 100 300 100 L350 100 C370 100 380 120 380 140 L380 200 L50 200 Z"
        fill="white"
        stroke="black"
        strokeWidth="2"
      />

      {/* Roof */}
      <path
        id="car-roof"
        d="M150 150 C200 150 220 60 300 60 L320 60 C340 60 350 80 350 100 L300 100 C200 100 150 150 150 150"
        fill="white"
        stroke="black"
        strokeWidth="2"
      />

      {/* Windows */}
      <path
        id="windshield"
        d="M160 140 C200 140 220 70 290 70 L310 70 C330 70 340 90 340 95 L300 95 C220 95 160 140 160 140"
        fill="white"
        stroke="black"
      />
      <rect
        id="side-window"
        x="300"
        y="70"
        width="40"
        height="30"
        fill="white"
        stroke="black"
      />

      {/* Wheels */}
      {[
        { x: 100, id: "wheel-1" },
        { x: 300, id: "wheel-2" },
      ].map((wheel) => (
        <g key={wheel.id}>
          <circle
            id={wheel.id}
            cx={wheel.x}
            cy="200"
            r="40"
            fill="white"
            stroke="black"
            strokeWidth="2"
          />
          <circle
            id={`${wheel.id}-inner`}
            cx={wheel.x}
            cy="200"
            r="25"
            fill="white"
            stroke="black"
          />
          {/* Spokes */}
          {[0, 45, 90, 135].map((angle, i) => (
            <line
              key={`${wheel.id}-spoke-${i}`}
              id={`${wheel.id}-spoke-${i}`}
              x1={wheel.x}
              y1="200"
              x2={wheel.x + 25 * Math.cos((angle * Math.PI) / 180)}
              y2={200 + 25 * Math.sin((angle * Math.PI) / 180)}
              stroke="black"
              strokeWidth="2"
            />
          ))}
        </g>
      ))}

      {/* Details */}
      <rect
        id="car-door"
        x="200"
        y="110"
        width="80"
        height="90"
        fill="none"
        stroke="black"
      />
      <circle
        id="door-handle"
        cx="260"
        cy="150"
        r="5"
        fill="white"
        stroke="black"
      />
      <rect
        id="headlight"
        x="350"
        y="120"
        width="20"
        height="15"
        fill="white"
        stroke="black"
      />
    </BaseTemplate>
  );
};

//Template for the House
const HouseTemplate = ({
  onClick,
  selectedElements,
  width = 400,
  height = 300,
  className,
}) => {
  return (
    <BaseTemplate
      onClick={onClick}
      selectedElements={selectedElements}
      width={width}
      height={height}
      className={className}
    >
      {/* House Body */}
      <rect
        id="house-body"
        x="50"
        y="150"
        width="300"
        height="200"
        fill="none"
        stroke="black"
      />

      {/* Roof */}
      <polygon
        id="roof"
        points="50,150 200,50 350,150"
        fill="none"
        stroke="black"
      />

      {/* Door */}
      <rect
        id="door"
        x="150"
        y="250"
        width="100"
        height="100"
        fill="none"
        stroke="black"
      />

      {/* Window 1 */}
      <rect
        id="window-1"
        x="75"
        y="175"
        width="60"
        height="50"
        fill="none"
        stroke="black"
      />
      {/* Window 1 panes (made colorable) */}
      <rect
        id="window-1-pane-1"
        x="75"
        y="175"
        width="30"
        height="25"
        fill="none"
        stroke="black"
      />
      <rect
        id="window-1-pane-2"
        x="105"
        y="175"
        width="30"
        height="25"
        fill="none"
        stroke="black"
      />
      <rect
        id="window-1-pane-3"
        x="75"
        y="200"
        width="30"
        height="25"
        fill="none"
        stroke="black"
      />
      <rect
        id="window-1-pane-4"
        x="105"
        y="200"
        width="30"
        height="25"
        fill="none"
        stroke="black"
      />

      {/* Window 2 */}
      <rect
        id="window-2"
        x="265"
        y="175"
        width="60"
        height="50"
        fill="none"
        stroke="black"
      />
      {/* Window 2 panes (made colorable) */}
      <rect
        id="window-2-pane-1"
        x="265"
        y="175"
        width="30"
        height="25"
        fill="none"
        stroke="black"
      />
      <rect
        id="window-2-pane-2"
        x="295"
        y="175"
        width="30"
        height="25"
        fill="none"
        stroke="black"
      />
      <rect
        id="window-2-pane-3"
        x="265"
        y="200"
        width="30"
        height="25"
        fill="none"
        stroke="black"
      />
      <rect
        id="window-2-pane-4"
        x="295"
        y="200"
        width="30"
        height="25"
        fill="none"
        stroke="black"
      />

      {/* Chimney */}
      <rect
        id="chimney"
        x="280"
        y="70"
        width="40"
        height="60"
        fill="none"
        stroke="black"
      />

      {/* Door Knob */}
      <circle
        id="door-knob"
        cx="240"
        cy="300"
        r="5"
        fill="none"
        stroke="black"
      />

      {/* Ground - making the area below the line colorable */}
      <rect
        id="ground"
        x="0"
        y="350"
        width="400"
        height="50"
        fill="none"
        stroke="black"
      />
    </BaseTemplate>
  );
};

//Flower Template
const FlowerTemplate = ({
  onClick,
  selectedElements,
  width = 400,
  height = 300,
  className,
}) => {
  return (
    <BaseTemplate
      onClick={onClick}
      selectedElements={selectedElements}
      width={width}
      height={height}
      className={className}
    >
      {/* Stem */}
      <path
        id="stem"
        d="M200 380 C200 380 200 280 200 250 C200 220 180 200 200 180"
        fill="none"
        stroke="black"
        strokeWidth="3"
      />

      {/* Leaves */}
      <path
        id="leaf-1"
        d="M200 300 C230 290 260 310 200 330"
        fill="white"
        stroke="black"
      />
      <path
        id="leaf-2"
        d="M200 250 C170 240 140 260 200 280"
        fill="white"
        stroke="black"
      />

      {/* Petals */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <g key={`petal-${i}`} transform={`rotate(${angle} 200 180)`}>
          <path
            id={`petal-${i}`}
            d="M200 180 C230 160 230 100 200 80 C170 100 170 160 200 180"
            fill="white"
            stroke="black"
          />
        </g>
      ))}

      {/* Center */}
      <circle
        id="flower-center"
        cx="200"
        cy="180"
        r="20"
        fill="white"
        stroke="black"
      />

      {/* Center Details */}
      {[...Array(12)].map((_, i) => (
        <circle
          key={`seed-${i}`}
          id={`seed-${i}`}
          cx={200 + 12 * Math.cos((i * Math.PI) / 6)}
          cy={180 + 12 * Math.sin((i * Math.PI) / 6)}
          r="3"
          fill="white"
          stroke="black"
        />
      ))}
    </BaseTemplate>
  );
};

export const TEMPLATE_MAPPING = {
  car: CarTemplate,
  flower: FlowerTemplate,
  house: HouseTemplate,
};
