import { Button } from '@mui/material';
import axios from 'axios';
import * as React from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';

const styles = {
  border: "3px solid black",
  borderRadius: "0.25rem",
  height: "600px"
};

function SketchCanvas() {
  const canvasRef = React.useRef(null);

  const searchSketch = async () => {
    canvasRef.current.exportImage("jpg").then(data => {
      const sketchData = { 'sketchData': data }
      axios.post(
        `http://localhost:5000/process_sketch`
        , sketchData, {
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(response => {
        console.log(response.data['message'])
      }).catch(error => {
        console.log('error', error)
      })

    });
  }

  return (
    <div>
      <ReactSketchCanvas
        style={styles}
        ref={canvasRef}
        strokeColor='black'
      />

      <div className="button-container" >
        <Button variant="contained" color="primary" onClick={searchSketch}>
          Search Sketch
        </Button>
        <Button variant="contained" color="primary" onClick={() => {
          canvasRef.current.clearCanvas()
        }}>
          Clear
        </Button>
      </div>
    </div>
  );
};

export default SketchCanvas;