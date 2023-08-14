import React, { useEffect, useState } from "react";
import ImageTable from "../ImagesTable/ImageTable";
import { createSearchParams, json, useNavigate } from 'react-router-dom';
import axios from "axios";
import CustomTextarea from "../CustomTextArea/CustomTextArea";

function MainSearchContainer() {
  const [inputQuery, setInputQuery] = useState('');
  const [imagesList, setImagesList] = useState([]);
  const navigate = useNavigate();

  const handleInputQueryChange = (value) => {
    setInputQuery(value);
  }

  const clearInputQuery = () => {
    setInputQuery('')
  }

   useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async ()=> {
     try {
      const response = await axios.get(
        `http://localhost:5000/get_all_images`
      );
      setImagesList(response.data['result']);
    } catch (error) {
      console.error('Error fetching image data:', error);
    }
  }

  const fetchImagesQueryData = async (inputValue) => {
    const params = { textquery: inputQuery }
    navigate({
      pathname: '/home/main',
      search: `?${createSearchParams(params)}`
    })

    try {
      const response = await axios.get(
        `http://localhost:5000/home/main/textsearch?textquery=${inputQuery}`
      );
      setImagesList(response.data['result']);
    } catch (error) {
      console.error('Error fetching image data:', error);
    }
  };

  const fetchImageSearch = async(imageId) => {
    console.log(imageId);
    const params = { imgid: imageId }
    navigate({
      pathname: '/home/main',
      search: `?${createSearchParams(params)}`
    })

    try {
      const response = await axios.get(
        `http://localhost:5000/home/main/imgsearch?imgid=${imageId}`
      );
      console.log(response.data['result'])
      setImagesList(response.data['result']);
    } catch (error) {
      console.error('Error fetching image data:', error);
    }
  }

  return (
    <React.Fragment>
      <CustomTextarea value={inputQuery} onChange={handleInputQueryChange} clearInput={clearInputQuery} onSubmit={fetchImagesQueryData}/>
      <ImageTable imagesList={imagesList} imagesPerPage={32} onImageSearch={fetchImageSearch}/>
    </React.Fragment>
  );
}

export default MainSearchContainer;
