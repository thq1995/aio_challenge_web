import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Container,
  Grid,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Link,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { TextareaAutosize } from "@mui/base";
import { Input } from "@mui/material";
import ImagesTable from "../ImagesTable/ImageTable";
import axios from "axios";
import { useNavigate, createSearchParams } from "react-router-dom";
import MainSearchContainer from "../MainSearchContainer/MainSearchContainer";
import styled from "@emotion/styled";

const ImageListItemWithStyle = styled(ImageListItem)(({ theme }) => ({
  "&:hover": {
    cursor: "pointer",
    opacity: 0.8,
    border: `solid 4px red`,
  },
}));

function SubsequentSearch({ subImages, selectedImages, setSelectedImages }) {
  console.log('subimages', subImages)

  const [imagesList, setImagesList] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
  }, []);

  const toggleImageSelection = (id, imageData, imageTitle) => {
    const imageObj = {
      '_id': id,
      'image_data': imageData,
      'filename': imageTitle
    }

    setSelectedImages((prevSelectedImages) => {
      if (prevSelectedImages.includes(imageObj['_id'])) {
        return prevSelectedImages.filter((_id) => _id !== id);
      } else {
        return [...prevSelectedImages, imageObj];
      }
    });
  };

  
  const isImageSelected = (imageId) => {
    return selectedImages.some((image) => image._id === imageId);
  };

  if (subImages !== undefined) {
    return (
      <React.Fragment>
        <ImageList sx={{ width: 'auto', height: 'auto' }} cols={2}>
          {subImages.map((image) => (
            <ImageListItemWithStyle key={image['_id']} className={`${isImageSelected(image["_id"]) ? 'selectedImage' : ''}`}>
              <Grid item>
                <Checkbox
                  checked={isImageSelected(image._id)}
                  onChange={() => toggleImageSelection(image['_id'], image['image_data'], image['filename'])}
                />
              </Grid>
              <ImageListItemBar
                title={image.filename.replace("images/keyframes/", "")}
                position="top"
              />
              <img
                src={`data:image/jpeg;base64,${image['image_data']}`}
                srcSet={`data:image/jpeg;base64,${image['image_data']}`}
                alt={image._id}
                loading="la
                zy"
              />
            </ImageListItemWithStyle>
          ))}
        </ImageList>
      </React.Fragment>
    );
  }

}

export default SubsequentSearch;
