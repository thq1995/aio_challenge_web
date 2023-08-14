import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import { Box, Button, Container, CssBaseline, Grid, TextField, Typography } from "@mui/material";
import { createSearchParams, json, useNavigate } from 'react-router-dom';
import "./CustomTextArea.css"

const InputContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  border: "2px solid #007bff",
  borderRadius: "8px",
  padding: "8px",
  width: "100%",
});

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
  const navigate = useNavigate();


  const searchQuery = async () => {
    const params = { textquery: value }
    navigate({
      pathname: '/home/main',
      search: `?${createSearchParams(params)}`
    })

    try {
      const response = await fetch('http://localhost:5000/home/main/textsearch?textquery=' + value)
      const data = await response.json();
      const imageList = data['result']
      console.log('textsearch', imageList)
    }
    catch (error) {
      console.log('Error fetching data', error)
    }
  }

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
