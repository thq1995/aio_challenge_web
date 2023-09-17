import { Button } from "@mui/material";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { styled } from "@mui/material/styles";
import "./CustomTextArea.css";
import React from "react";

const StyledTextarea = styled(TextareaAutosize)({
  width: '95%',
  padding: '12px',
  fontSize: '16px',
  border: '4px solid black',
  borderRadius: '4px',
  resize: 'vertical',
  transition: 'border-color 0.2s ease-in-out',
  '&:focus': {
    outline: 'none',
    borderColor: '#007bff',
  },
});


const CustomTextarea = ({ value, onChange, clearInput, onSubmit }) => {
  return (
    <React.Fragment>
      <StyledTextarea
        onChange={(e) => onChange(e.target.value)}
        value={value}
        minRows={2}
        maxRows={10}
        aria-label="textarea"
        placeholder="Enter your text to search..."
      />

      <div className="button-container" >
        <Button variant="contained" color="primary" onClick={onSubmit}>
        Search
        </Button>
        <Button variant="contained" color="primary" onClick={clearInput}>
          Clear
        </Button>
      </div>
    </React.Fragment>
  );
};

export default CustomTextarea;
