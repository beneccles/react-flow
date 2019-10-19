import React, { Component, useState, useEffect, useRef } from 'react';

export default function Flow() {
    const canvasRef = React.useRef(null);
    const [ctx, setCtx] = useState(null);  // We are using useState here so we can maintain the getContext value.

    // useEffect is the Hooks equivalent of componentDidMount among other things.
    useEffect(() => {
        // set canvas to the current element referenced as canvasRef
        const canvas = canvasRef.current;
        setCtx(canvas.getContext('2d')) //Set context to ctx, so we can call it later.
    })



    // This hook maintains an object to hold the status of the mouse cursor. 
    // Whenever the mouse is moved or pressed, there are event handlers that update
    // the values in the array.
    const [mouse, setMouse] = useState({
        x: 0, y:0, px:0, py: 0, down: false
    })


    const [canvas_width, setCanvasWidth] = useState(500) // Multiple of the resolution variable
    const [canvas_height, setCanvasHeight] = useState(500) // Multiple of the resolution variable
    const [resolution, setResolution] = useState(10) // Width and height of each cell in the grid.
    const [pen_size, setPenSize] = useState(40) // Radius around the mouse cursor
    const [num_cols, setNumCols] = useState(canvas_width / resolution) // Number of Columns
    const [num_rows, setNumRows] = useState(canvas_height / resolution) // Number of Rows
    const [speck_count, setSpeckCount] = useState(5000) // Determines the number of particles to be animated.
    const [vec_cells, setVecCells] = useState([]) // Grid Cell Array
    const [particles, setParticles] = useState([]) // Particle Array

    function init() {
        // canvasRef
        // ctx

        // Set the width and height of the canvas to the values we defined earlier.
        canvasRef.width = canvas_width;
        canvasRef.height = canvas_height;

        // For Loop to add the defined number of specs to the particle array.
        for (let i = 0; i < speck_count; i++) {
            
        }
    }

    return (
        <div>
        <button onClick={init()}>Click to Init</button>
        <canvas ref={canvasRef}></canvas>
        </div>
    )
}