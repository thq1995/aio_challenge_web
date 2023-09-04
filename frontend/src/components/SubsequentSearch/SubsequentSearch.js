import {
  Autocomplete,
  Box,
  Button,
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

function SubsequentSearch({subImages}) {
  console.log('subimages', subImages)

  const [imagesList, setImagesList] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
  }, []);
  
  if(subImages !== undefined){
    return (
      <React.Fragment>
        <ImageList sx={{ width: 500, height: 550 }} cols={2} rowHeight={164}>
          {subImages.map((image) => (
            <ImageListItemWithStyle key={image['_id']}>
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
