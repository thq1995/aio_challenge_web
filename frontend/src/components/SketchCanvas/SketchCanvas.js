import { Button } from '@mui/material';
import * as React from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';

const styles = {
  border: "3px solid black",
  borderRadius: "0.25rem"
};

const SketchCanvas = class extends React.Component {
  constructor(props) {
    super(props);

    this.canvas = React.createRef();
  }

  render() {
    return (
      <div>
        <ReactSketchCanvas
          style={styles}
          ref={this.canvas}
          strokeWidth={5}
          strokeColor="black"
        />
        <Button variant="contained" onClick={() => {
          this.canvas.current
            .exportImage("png")
            .then(data => {
              console.log(data);
            })
            .catch(e => {
              console.log(e);
            });
        }}>
          Search Sketch
        </Button>
        <Button variant="contained" onClick={() => {
          this.canvas.current
            .clearCanvas()
        }}>
          Clear Sketch
        </Button>
      </div>
    );
  }
};

export default SketchCanvas;