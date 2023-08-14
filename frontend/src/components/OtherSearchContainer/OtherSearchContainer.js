import {
  Autocomplete,
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { TextareaAutosize } from "@mui/base";
import { Input } from "@mui/material";
import ImagesTable from "../ImagesTable/ImageTable";
import axios from "axios";
import { useNavigate, createSearchParams} from "react-router-dom";
import MainSearchContainer from "../../MainSearchContainer/MainSearchContainer";


function OtherSearchContainer() {
  const top100Films = ["test1", "test2", "test3"];
  const [imagesList, setImagesList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/get_all_images`
      );
      setImagesList(response.data['result']);
    } catch (error) {
      console.error('Error fetching image data:', error);
    }
  }

  const fetchImageSearch = async(imageId) => {
    const params = { imgid: imageId }
    navigate({
      pathname: '/home/main',
      search: `?${createSearchParams(params)}`
    })

    try {
      const response = await axios.get(
        `http://localhost:5000/home/main/imgsearch?imgid=${imageId}`
      );
      setImagesList(response.data['result']);
    } catch (error) {
      console.error('Error fetching image data:', error);
    }
  }

  return (
    <ImagesTable imagesList={imagesList} imagesPerPage={20} onImageSearch={fetchImageSearch}/>
  );
}

export default OtherSearchContainer;
