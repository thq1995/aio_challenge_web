import React from "react";
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

function Home() {
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
      <Grid container spacing={2} sx={{p: 0.5}}>
        <Grid item xs={12} md={12} lg={9} xl={8}>
          <Paper
            elevation={1}
            sx={{
              p: 2.5,
              display: "flex",
              flexDirection: "column",
              borderRadius: "8px",
              height: '1250px'
            }}
          >
            <MainSearchContainer />
          </Paper>
        </Grid>
        <Grid item xs={12} md={12} lg={3} xl={4}>
          <Paper
            elevation={1}
            sx={{
              p: 1.5,
              display: "flex",
              flexDirection: "column",
              borderRadius: "8px",
              height: '1270px',
              backgroundColor: '#'
            }}
          >
            <OtherSearchContainer/>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default Home;
