import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Grid, ImageList, ImageListItem, ImageListItemBar, Pagination, PaginationItem } from "@mui/material";
import "./ImageTable.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import styled from "@emotion/styled";


const ImageListItemWithStyle = styled(ImageListItem)(({ theme }) => ({
  "&:hover": {
    cursor: "pointer",
    opacity: 0.8,
    border: `solid 2px red`,
  },
}));

function ImageTable({ imagesList, imagesPerPage, imageLength, onImageSearch, updateFetchImages, textsearch, clearPage }) {
  const [page, setPage] = useState(1);
  console.log('imageLength', imagesPerPage)

  const handleChangePage = (event, newPage) => {
    if (clearPage) {
      setPage(1);
    }
    else {
      setPage(newPage);
    }
    updateFetchImages(newPage);
  };
  console.log('test sub image list', imagesList)
  const startIndex = (page - 1) * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;
  console.log('text_search', textsearch)
  if (textsearch) {
    console.log('test text search')
    imagesList = imagesList.slice(startIndex, endIndex);
  }

  if (imageLength !== undefined) {
    return (
      <div>
        <React.Fragment>
          <Grid container sx={{ pt: 3 }}>
            <ImageList sx={{ width: 'auto', height: '700px' }} cols={3} rowHeight={164}>
              {imagesList.map((image) => (
                <ImageListItemWithStyle key={image.img}>
                  <ImageListItemBar
                    title={image.filename.replace("images/keyframes/", "")}
                    position="above"
                  />
                  <img
                    className="image"
                    onClick={() => onImageSearch(image['_id'])}
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
              count={Math.ceil(imageLength / imagesPerPage)}
              color="primary"
              showFirstButton showLastButton
              page={page}
              onChange={handleChangePage}
            />
          </Grid>


        </React.Fragment>
      </div >
    );
  }

}

export default ImageTable;
