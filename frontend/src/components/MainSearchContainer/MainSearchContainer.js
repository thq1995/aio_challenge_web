import React, { useEffect, useState } from "react";
import ImageTable from "../ImagesTable/ImageTable";
import { createSearchParams, json, useNavigate } from 'react-router-dom';
import axios from "axios";
import CustomTextarea from "../CustomTextArea/CustomTextArea";
import { Checkbox, Grid, ImageList, ImageListItem, ImageListItemBar, Pagination, styled } from "@mui/material";
import "./MainSearchContainer.css"

const ImageListItemWithStyle = styled(ImageListItem)(({ theme }) => ({
  "&:hover": {
    cursor: "pointer",
    opacity: 0.8,
    border: `solid 5px red`,
  },
}));

function MainSearchContainer({ subImages, setSubImages, selectedImages, setSelectedImages }) {
  const [inputQuery, setInputQuery] = useState('');
  const [imagesList, setImagesList] = useState([]);
  const [imageLength, setImageLength] = useState(0);
  const [textSearch, setTextSearch] = useState(false);
  const [iamgePerPage, setImagePerPage] = useState(32);
  const [clearPage, setClearPage] = useState(false);
  const [page, setPage] = useState(1);
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

  const fetchImages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/get_all_images/pages?page=1&page_size=28`
      );
      setImagesList(response.data['result']);
      setImageLength(response.data['images_length'])
      setImagePerPage(28)
    } catch (error) {
      console.error('Error fetching image data:', error);
    }
  }

  const handleChangePage = (event, newPage) => {
    if (clearPage) {
      setPage(1);
    }
    else {
      setPage(newPage);
    }
    updateFetchImages(newPage);
  };

  const updateFetchImages = async (page) => {
    if (textSearch) {
      return
    }
    try {
      const response = await axios.get(
        `http://localhost:5000/get_all_images/pages?page=${page}&page_size=28`
      );
      console.log('image_response', response)
      setImagesList(response.data['result']);
      setImageLength(response.data['images_length'])
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
      setImageLength(response.data['images_length'])
      setTextSearch(true);
      setClearPage(true);
    } catch (error) {
      console.error('Error fetching image data:', error);
    }
  };

  const fetchImageSearch = async (imageId, filename) => {
    console.log(imageId);
    const params = { imgid: imageId }
    navigate({
      pathname: '/home/main',
      search: `?${createSearchParams(params)}`
    })


    try {
      const image_response = await axios.get(
        `http://localhost:5000/home/main/imgsearch?imgid=${imageId}`
      );
      const sub_image_response = await axios.get(
        `http://localhost:5000/subimgsearch?imageId=${imageId}`
      )
      setImagesList(image_response.data['result']);
      setSubImages(sub_image_response.data['result']);

      console.log('checkdata', subImages)
      setPage(1);
    } catch (error) {
      console.error('Error fetching image data:', error);
    }
  }

  const toggleImageSelection = (id, imageData, imageTitle) => {
    setSelectedImages((prevSelectedImages) => {
      const isSelected = prevSelectedImages.some((image) => image._id === id);

      if (isSelected) {
        // If the image with the given ID is already selected, remove it
        return prevSelectedImages.filter((image) => image._id === id);
      } else {
        // If the image is not selected, add it

        const imgObj = {
          _id: id,
          image_data: imageData,
          filename: imageTitle
        };
        console.log('imageObj-test', imgObj)
        console.log('imageObj-test-pre', prevSelectedImages)
        console.log('selected-image', selectedImages)

        return [...prevSelectedImages, imgObj];
      }
    });
  };


  const isImageSelected = (imageId) => {
    return selectedImages.some((image) => image._id === imageId);
  };

  return (
    <React.Fragment>
      <CustomTextarea value={inputQuery} onChange={handleInputQueryChange} clearInput={clearInputQuery} onSubmit={fetchImagesQueryData} />
      <Grid container sx={{ pt: 3 }}>
        <ImageList sx={{ width: 'auto', height: 'auto' }} cols={5} rowHeight={'auto'} >
          {imagesList.map((image) => (
            <ImageListItemWithStyle key={image["_id"]} className={`${isImageSelected(image["_id"]) ? 'selectedImage' : ''}`}>
              <ImageListItemBar
                title={image.filename.replace("images/keyframes/", "")}
                position="top"

              />
              <Grid item>
                <Checkbox
                  checked={isImageSelected(image._id)}
                  onChange={() => toggleImageSelection(image['_id'], image['image_data'], image['filename'])}
                />
              </Grid>
              <img
                onClick={() => fetchImageSearch(image['_id'], image['filename'])}
                style={{ cursor: 'pointer' }}
                src={`data:image/jpeg;base64,${image['image_data']}`}
                srcSet={`data:image/jpeg;base64,${image['image_data']}`}
                loading="lazy"
                alt={`image-${image['filename']}`}
              />


            </ImageListItemWithStyle>
          ))}
        </ImageList>
      </Grid>
      <Grid container justifyContent="center" alignItems="center">
        <Pagination
          count={Math.ceil(imageLength / iamgePerPage)}
          color="primary"
          showFirstButton showLastButton
          page={page}
          onChange={handleChangePage}
        />
      </Grid>
    </React.Fragment>
  );
}

export default MainSearchContainer;
