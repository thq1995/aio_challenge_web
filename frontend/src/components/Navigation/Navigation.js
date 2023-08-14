import React, { useState } from "react";
import { Navbar, Nav } from "react-bootstrap";
import "./Navigation.css";
import {
  AppBar,
  Button,
  Collapse,
  IconButton,
  Link,
  ToggleButton,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

function Navigation() {
  return (
    <React.Fragment>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}`, backgroundColor: '#388087'}}
      >
        <Toolbar sx={{ flexWrap: "wrap"}}>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1, fontFamily: 'Valorax'}}>
            <a href="/home" style={{textDecoration: 'none', color: '#FFFFFF'}}> AIO - Pending</a>
          </Typography>
          <nav>
            <Link
              variant="button"
              color="#FFFFFF"
              href="/home"
              sx={{ my: 1, mx: 1.5, fontFamily: 'Valorax' }}
            >
              Home
            </Link>
            <Link
              variant="button"
              color="#FFFFFF"
              href="/about"
              sx={{ my: 1, mx: 1.5, fontFamily: 'Valorax' }}
            >
              About
            </Link>
          </nav>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}

export default Navigation;
