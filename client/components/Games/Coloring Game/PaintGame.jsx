"use client"
import React, { useState } from 'react';

const SVGColoringTemplates = () => {
  const [selectedColor, setSelectedColor] = useState('#FF0000');
  const [selectedTemplate, setSelectedTemplate] = useState('car');
  const [lastColoredElement, setLastColoredElement] = useState('');

  const colors = [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#A52A2A',
    '#808080', '#000000', '#FFFFFF', '#FFA500', '#800080',
    '#008000', '#00FFFF', '#ADD8E6', '#F0E68C', '#D3D3D3'
  ];

  const handleColorClick = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.setAttribute('fill', selectedColor);
      setLastColoredElement(id);
    }
  };

  const CarTemplate = () => (
    <svg id="svg-car" width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      {/* Car Body */}
      <path id="car-body" d="M50 150 L100 150 C150 150 200 100 300 100 L350 100 C370 100 380 120 380 140 L380 200 L50 200 Z" 
        fill="white" stroke="black" strokeWidth="2" onClick={() => handleColorClick('car-body')}/>
      
      {/* Roof */}
      <path id="car-roof" d="M150 150 C200 150 220 60 300 60 L320 60 C340 60 350 80 350 100 L300 100 C200 100 150 150 150 150" 
        fill="white" stroke="black" strokeWidth="2" onClick={() => handleColorClick('car-roof')}/>
      
      {/* Windows */}
      <path id="windshield" d="M160 140 C200 140 220 70 290 70 L310 70 C330 70 340 90 340 95 L300 95 C220 95 160 140 160 140" 
        fill="white" stroke="black" onClick={() => handleColorClick('windshield')}/>
      <rect id="side-window" x="300" y="70" width="40" height="30" fill="white" stroke="black" 
        onClick={() => handleColorClick('side-window')}/>
      
      {/* Wheels */}
      {[{x: 100, id: 'wheel-1'}, {x: 300, id: 'wheel-2'}].map((wheel) => (
        <g key={wheel.id}>
          <circle id={wheel.id} cx={wheel.x} cy="200" r="40" fill="white" stroke="black" strokeWidth="2" 
            onClick={() => handleColorClick(wheel.id)}/>
          <circle id={`${wheel.id}-inner`} cx={wheel.x} cy="200" r="25" fill="white" stroke="black" 
            onClick={() => handleColorClick(`${wheel.id}-inner`)}/>
          {/* Spokes */}
          {[0, 45, 90, 135].map((angle, i) => (
            <line key={`${wheel.id}-spoke-${i}`}
              id={`${wheel.id}-spoke-${i}`}
              x1={wheel.x} y1="200"
              x2={wheel.x + 25 * Math.cos(angle * Math.PI / 180)}
              y2={200 + 25 * Math.sin(angle * Math.PI / 180)}
              stroke="black" strokeWidth="2"
            />
          ))}
        </g>
      ))}
      
      {/* Details */}
      <rect id="car-door" x="200" y="110" width="80" height="90" fill="none" stroke="black" 
        onClick={() => handleColorClick('car-door')}/>
      <circle id="door-handle" cx="260" cy="150" r="5" fill="white" stroke="black" 
        onClick={() => handleColorClick('door-handle')}/>
      <rect id="headlight" x="350" y="120" width="20" height="15" fill="white" stroke="black" 
        onClick={() => handleColorClick('headlight')}/>
    </svg>
  );

  const HouseTemplate = () => (
    <svg id="svg-image" width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
          {/* House Body */}
          <rect id="house-body" x="50" y="150" width="300" height="200" fill="none" stroke="black" onClick={() => handleColorClick('house-body')} />

          {/* Roof */}
          <polygon id="roof" points="50,150 200,50 350,150" fill="none" stroke="black" onClick={() => handleColorClick('roof')} />

          {/* Door */}
          <rect id="door" x="150" y="250" width="100" height="100" fill="none" stroke="black" onClick={() => handleColorClick('door')} />

          {/* Window 1 */}
          <rect id="window-1" x="75" y="175" width="60" height="50" fill="none" stroke="black" onClick={() => handleColorClick('window-1')} />
          {/* Window 1 panes (made colorable) */}
          <rect id="window-1-pane-1" x="75" y="175" width="30" height="25" fill="none" stroke="black" onClick={() => handleColorClick('window-1-pane-1')}/>
          <rect id="window-1-pane-2" x="105" y="175" width="30" height="25" fill="none" stroke="black" onClick={() => handleColorClick('window-1-pane-2')}/>
          <rect id="window-1-pane-3" x="75" y="200" width="30" height="25" fill="none" stroke="black" onClick={() => handleColorClick('window-1-pane-3')}/>
          <rect id="window-1-pane-4" x="105" y="200" width="30" height="25" fill="none" stroke="black" onClick={() => handleColorClick('window-1-pane-4')}/>

          {/* Window 2 */}
          <rect id="window-2" x="265" y="175" width="60" height="50" fill="none" stroke="black" onClick={() => handleColorClick('window-2')} />
          {/* Window 2 panes (made colorable) */}
          <rect id="window-2-pane-1" x="265" y="175" width="30" height="25" fill="none" stroke="black" onClick={() => handleColorClick('window-2-pane-1')}/>
          <rect id="window-2-pane-2" x="295" y="175" width="30" height="25" fill="none" stroke="black" onClick={() => handleColorClick('window-2-pane-2')}/>
          <rect id="window-2-pane-3" x="265" y="200" width="30" height="25" fill="none" stroke="black" onClick={() => handleColorClick('window-2-pane-3')}/>
          <rect id="window-2-pane-4" x="295" y="200" width="30" height="25" fill="none" stroke="black" onClick={() => handleColorClick('window-2-pane-4')}/>

          {/* Chimney */}
          <rect id="chimney" x="280" y="70" width="40" height="60" fill="none" stroke="black" onClick={() => handleColorClick('chimney')} />

          {/* Door Knob */}
          <circle id="door-knob" cx="240" cy="300" r="5" fill="none" stroke="black" onClick={() => handleColorClick('door-knob')}/>
          
          {/* Ground - making the area below the line colorable */}
          <rect id="ground" x="0" y="350" width="400" height="50"  fill="none" stroke="black" onClick={() => handleColorClick('ground')}/>


        </svg>
  );

  const FlowerTemplate = () => (
    <svg id="svg-flower" width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      {/* Stem */}
      <path id="stem" d="M200 380 C200 380 200 280 200 250 C200 220 180 200 200 180" 
        fill="none" stroke="black" strokeWidth="3" onClick={() => handleColorClick('stem')}/>
      
      {/* Leaves */}
      <path id="leaf-1" d="M200 300 C230 290 260 310 200 330" fill="white" stroke="black" 
        onClick={() => handleColorClick('leaf-1')}/>
      <path id="leaf-2" d="M200 250 C170 240 140 260 200 280" fill="white" stroke="black" 
        onClick={() => handleColorClick('leaf-2')}/>
      
      {/* Petals */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <g key={`petal-${i}`} transform={`rotate(${angle} 200 180)`}>
          <path id={`petal-${i}`}
            d="M200 180 C230 160 230 100 200 80 C170 100 170 160 200 180"
            fill="white" stroke="black"
            onClick={() => handleColorClick(`petal-${i}`)}
          />
        </g>
      ))}
      
      {/* Center */}
      <circle id="flower-center" cx="200" cy="180" r="20" fill="white" stroke="black" 
        onClick={() => handleColorClick('flower-center')}/>
      
      {/* Center Details */}
      {[...Array(12)].map((_, i) => (
        <circle key={`seed-${i}`}
          id={`seed-${i}`}
          cx={200 + 12 * Math.cos(i * Math.PI / 6)}
          cy={180 + 12 * Math.sin(i * Math.PI / 6)}
          r="3"
          fill="white" stroke="black"
          onClick={() => handleColorClick(`seed-${i}`)}
        />
      ))}
    </svg>
  );

  




  const templates = {
    car: CarTemplate,
    flower: FlowerTemplate,
    house: HouseTemplate,

  };

  const SelectedTemplate = templates[selectedTemplate];

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex gap-4 mb-4">
        {Object.keys(templates).map((template) => (
          <button
            key={template}
            className={`px-4 py-2 rounded ${
              selectedTemplate === template ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setSelectedTemplate(template)}
          >
            {template.charAt(0).toUpperCase() + template.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-2 mb-4">
        {colors.map((color) => (
          <button
            key={color}
            className="w-8 h-8 rounded border border-gray-300 hover:border-gray-500"
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColor(color)}
          />
        ))}
      </div>

      {lastColoredElement && (
        <div className="text-sm text-gray-600 mb-2">
          Last colored: {lastColoredElement}
        </div>
      )}

      <div className="border rounded p-4 bg-gray-50">
        <SelectedTemplate />
      </div>
    </div>
  );
};

export default SVGColoringTemplates;