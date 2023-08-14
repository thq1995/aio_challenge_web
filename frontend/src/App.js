import "./App.css";
import logo from './logo.svg';
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  BrowserRouter,
  Routes,
  Navigate
} from "react-router-dom";


import Navigation from "./components/Navigation/Navigation.js";
import About from "./components/About/About";
import Layout from "./components/Layout/Layout";
import PageNotFound from "./components/PageNotFound/PageNotFound";
import Home from "./components/Home/Home";
import MainSearchContainer from "./components/MainSearchContainer/MainSearchContainer";

function App() {
  return (
    <div className="font-face-gm">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/" element={<Layout />}>
            <Route path="/home" element={<Home />}>
              <Route path="main" element={<MainSearchContainer/>}/>
            </Route>
            <Route path="/about" element={<About />} />
            <Route path="/*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
