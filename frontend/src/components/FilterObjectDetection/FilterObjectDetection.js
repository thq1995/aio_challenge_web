import React, { useState } from 'react';
import {
  Checkbox,
  TextField,
  FormControlLabel,
  FormGroup,
  Grid,
  Typography,
  Button,
} from '@mui/material';
import axios from 'axios';

function FilterObjectDetection() {
  const [checkboxValues, setCheckboxValues] = useState({
    femaleCheckbox: false,
    maleCheckbox: false,
    bothCheckbox: false,
  });

  const [textFieldValues, setTextFieldValues] = useState({
    femaleTextfield: '',
    maleTextfield: '',
    bothTextfield: '',
  });

  const handleCheckboxChange = (event) => {
    setCheckboxValues({
      ...checkboxValues,
      [event.target.name]: event.target.checked,
    });
  };

  const handleTextFieldChange = (event) => {
    setTextFieldValues({
      ...textFieldValues,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      // Convert the values to integers for comparison
      const totalValue = parseInt(textFieldValues.bothTextfield) || 0;
      const femaleValue = parseInt(textFieldValues.femaleTextfield) || 0;
      const maleValue = parseInt(textFieldValues.maleTextfield) || 0;

      console.log('total', totalValue)
      console.log('female', femaleValue)
      console.log('male', maleValue)

      if (femaleValue + maleValue <= totalValue) {
        const data = {
          checkboxes: checkboxValues,
          textfields: textFieldValues,
        };

        const response = await axios.post('http://localhost:5000/object_detect_search', data);

        console.log('Response from the backend:', response.data);
      } else {
        alert('The sum of "Female" and "Male" values exceeds "Total".');
      }
    } catch (error) {
      alert('Error sending data to the backend:', error);
    }
  };

  return (
    <div>
      <FormGroup>
        <Grid container spacing={2}>
          {['Female', 'Male', 'Both'].map((checkboxName) => (
            <Grid item xs={12} sm={6} key={checkboxName}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkboxValues[`${checkboxName.toLowerCase()}Checkbox`]}
                    onChange={handleCheckboxChange}
                    name={`${checkboxName.toLowerCase()}Checkbox`}
                    color="primary"
                  />
                }
                label={
                  <>
                    <Typography variant="body1">{checkboxName}</Typography>
                    <TextField
                      disabled={!checkboxValues[`${checkboxName.toLowerCase()}Checkbox`]}
                      value={textFieldValues[`${checkboxName.toLowerCase()}Textfield`]}
                      onChange={handleTextFieldChange}
                      name={`${checkboxName.toLowerCase()}Textfield`}
                      label="Type a number"
                      variant="outlined"
                      type="number"
                    />
                  </>
                }
              />
            </Grid>
          ))}
        </Grid>
      </FormGroup>

      <div className="button-container" >
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
}

export default FilterObjectDetection;
