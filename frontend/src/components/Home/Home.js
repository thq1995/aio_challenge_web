import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import {
  Button,
  Card,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import OtherSearchContainer from "../OtherSearchContainer/OtherSearchContainer";
import MainSearchContainer from "../MainSearchContainer/MainSearchContainer";
import SubsequentSearch from "../SubsequentSearch/SubsequentSearch";
import ImagePicker from "../ImagePicker/ImagePicker";

function Home() {
  const [subImages, setSubImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  console.log('home-selectd-images-picker', selectedImages)
  
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

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
      <Grid container spacing={2}>
        {/* left container */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={1}
            sx={{
              p: 2.5,
              display: "flex",
              flexDirection: "column",
              borderRadius: "8px",
              height: 'auto'
            }}
          >
            <MainSearchContainer subImages={subImages} setSubImages={setSubImages} selectedImages={selectedImages} setSelectedImages={setSelectedImages} />
          </Paper>
        </Grid>

        {/* Right containers */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper
                elevation={1}
                sx={{
                  p: 1.5,
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "8px",
                  height: '400px',
                  backgroundColor: '#'
                }}
                style={{ padding: '20px' }}
              >
                <SubsequentSearch subImages={subImages} selectedImages={selectedImages} setSelectedImages={setSelectedImages}/>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper
                elevation={1}
                sx={{
                  p: 1.5,
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "8px",
                  height: '450px',
                  backgroundColor: '#'
                }}
                style={{ padding: '20px' }}
              >
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Paper
            elevation={1}
            sx={{
              p: 1.5,
              display: "flex",
              flexDirection: "column",
              borderRadius: "8px",
              height: '400px',
              backgroundColor: '#'
            }}
            style={{ padding: '20px' }}
          >
            <ImagePicker selectedImages={selectedImages} setSelectedImages={setSelectedImages} />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default Home;
