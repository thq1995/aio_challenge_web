import React, { useState } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid, Paper } from '@mui/material';
import ImagePicker from '../ImagePicker/ImagePicker';
import MainSearchContainer from '../MainSearchContainer/MainSearchContainer';
import SubsequentSearch from "../SubsequentSearch/SubsequentSearch";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs({ selectedImages, setSelectedImages, subImages, setSubImages }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Grid container spacing={2} pt={2}>
      <Grid item xs={12} sm={12}>
        <Paper
          elevation={1}
          sx={{
            p: 1.5,
            display: "flex",
            flexDirection: "column",
            borderRadius: "8px",
            height: 'auto',
            backgroundColor: '#'
          }}
          style={{ padding: '20px' }}
        >
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
                <Tab label="CLIP" {...a11yProps(0)} />
                <Tab label="SS" {...a11yProps(1)} />
                <Tab label="OCR" {...a11yProps(2)} />
                <Tab label="ASR" {...a11yProps(2)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <MainSearchContainer subImages={subImages} setSubImages={setSubImages} selectedImages={selectedImages} setSelectedImages={setSelectedImages} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <SubsequentSearch subImages={subImages} selectedImages={selectedImages} setSelectedImages={setSelectedImages}/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              This is OCR Search
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
              This is ASR Search
            </CustomTabPanel>
            <CustomTabPanel value={value} index={4}>
              This is ASR Search
            </CustomTabPanel>
          </Box>
        </Paper>
      </Grid>
    </Grid >
  );
}
