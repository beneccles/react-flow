import React, {  useState, useEffect, useRef } from 'react';

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
            // Call particle() with random coordinates, pushing it onto the end of the array.
            // Particle is written further down, so this will error out for now.
            // Thanks to hoisting though, this will still work!
            particles.push(new particle(Math.random() * canvas_width, Math.random() * canvas_height))
        }

        for (let col = 0; col < num_cols; col++) {
            // Defines the array element as another array. (with Hooks)
            const newVec = vec_cells;
            newVec[col] = [];
            setVecCells(newVec)

            for (let row = 0; row < num_rows; row++) {
                // Call cell(), which creates an individual grid cell and returns it as an object.
                // The X and Y values are multiplied by the resolution so that when the loops are referring to "column 2, row 2", the
                // width and height of "column 1, row 1" are counted in so that the top-left corner of the new grid cell is at the bottom right of the other cell.
                let cell_data = new cell(col * resolution, row * resolution, resolution)

                // Push the new cell object into the grid array.
                let newData = vec_cells;
                newData[col][row] = cell_data;

                // Update value on useState
                setVecCells(newData)

                // Update the object's column and row values, so the object knows where in the grid it is positioned.
                newData = vec_cells;
                newData[col][row].col = col;
                newData[col][row].row = row;

                // Update value on useState
                setVecCells(newData)
            }
        }

        for (let col = 0; col < num_cols; col++) {
            for (let row = 0; row < num_rows; row++) {
                let cell_data = vec_cells[col][row];

                let row_up = (row - 1 >= 0) ? row - 1 : num_rows - 1;
                let col_left = (col - 1 >= 0) ? col - 1 : num_cols - 1;
                let col_right = (col + 1 < num_cols) ? col + 1 : 0;

                let up = vec_cells[col][row_up];
                let left = vec_cells[col_left][row];
                let up_left = vec_cells[col_left][row_up];
                let up_right = vec_cells[col_right][row_up];

                cell_data.up = up;
                cell_data.left = left;
                cell_data.up_left = up_left;
                cell_data.up_right = up_right;

                up.down = vec_cells[col][row];
                left.right = vec_cells[col][row];
                up_left.down_right = vec_cells[col][row];
                up_right.down_left = vec_cells[col][row];
            }
        }

        w.addEventListener("mousedown", mouse_down_handler);
        w.addEventListener("touchstart", mouse_down_handler);

        w.addEventListener("mouseup", mouse_up_handler);
        w.addEventListener("touchend", touch_end_handler);

        canvas.addEventListener("mousemove", mouse_move_handler);
        canvas.addEventListener("touchmove", touch_move_handler)

        w.onload = draw;
    }

    function update_particle() {
        for (let i = 0; i < particles.length; i++){
            // Local reference to the particles array
            let p = particles[i];

            if (p.x >= 0 && p.x < canvas_width && p.y >= 0 && p.y < canvas_height ) {
                // Divde the X and Y values by the size of each cell.
                // The number is then parsed to a whole number to determine which grid cell the particle is above.
                let col = parseInt(p.x / resolution);
                let row = parseInt(p.y / resolution);

                // Store the reference to the cell.
                let cell_data = vec_cells[col][row];


                let ax = (p.x % resolution) / resolution;
                let ay = (p.y % resolution) / resolution;

                p.xv += (1 - ax) * cell_data.xv * 0.05;
                p.yv += (1 - ay) * cell_data.yv * 0.05;

                p.xv += ax * cell_data.right.xv * 0.05;
                p.yv += ax * cell_data.right.yv * 0.05;

                p.xv += ay * cell_data.down.xv * 0.05;
                p.yv += ay * cell_data.down.yv * 0.05;

                // Add the calculated velocity to the position coordinates of the particle.
                p.x += p.xv;
                p.y += p.yv;

                // For each axis, this gets the distance between the old position of the particle and it's new position.
                let dx = p.px - p.x;
                let dy = p.py - p.y;

                // Determine the distance the particle traveled.
                let dist = Math.sqrt(dx * dx + dy * dy);

                // Generate a random value between 0 and 0.5
                let limit = Math.random() * 0.5;
                
            }
        }
    }

    return (
        <div>
        {/* <button onClick={init()}>Click to Init</button> */}
        <canvas ref={canvasRef}></canvas>
        </div>
    )
}