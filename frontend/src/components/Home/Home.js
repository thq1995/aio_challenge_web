import {
  Typography
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import React, { useState } from "react";
import ImagePicker from "../ImagePicker/ImagePicker";
import MainSearchContainer from "../MainSearchContainer/MainSearchContainer";
import SubsequentSearch from "../SubsequentSearch/SubsequentSearch";
import SketchCanvas from "../SketchCanvas/SketchCanvas";
import CustomTextarea from "../CustomTextArea/CustomTextArea";
import BasicTabs from "../CustomTabPanel/CustomTabPanel";

function Home() {
  const [subImages, setSubImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  console.log('home-selectd-images-picker', selectedImages)

  // useEffect = () => {

  // }

  return (
    <div>
      <Typography
        component="p"
        variant="h3"
        fontSize="bold"
        color="#FFAE42"
        align="center"
        fontFamily="Valorax"
      >
        Image Text Retrieval
      </Typography>
      <Grid container spacing={2} >
        <Grid item xs={12} sm={12}>
          <Paper
            elevation={1}
            sx={{
              p: 1.5,
              display: "flex",
              flexDirection: "column",
              borderRadius: "8px",
              height: '500px',
              backgroundColor: '#'
            }}
            style={{ padding: '20px' }}
          >
            <ImagePicker selectedImages={selectedImages} setSelectedImages={setSelectedImages} />
          </Paper>
        </Grid>
      </Grid>
      <BasicTabs selectedImages={selectedImages} setSelectedImages={setSelectedImages} subImages={subImages} setSubImages={setSubImages} />
    </div>
  );
}

export default Home;
