import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Grid, ImageList, ImageListItem, Pagination, PaginationItem } from "@mui/material";
import "./ImageTable.css";

function ImagesTable({ imagesList, imagesPerPage, onImageSearch}) {
  const [page, setPage] = useState(1);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const startIndex = (page - 1) * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;

  const displayedImages = imagesList.slice(startIndex, endIndex);

  return (
    <div>
      <React.Fragment>
        <Grid container sx={{ pt: 3 }}>
          {displayedImages && displayedImages.map((image, index) => (
            <div key={image['_id']} className="image-container">
              <img
                className="image"
                onClick={() => onImageSearch(image['_id'])}
                style={{ cursor: 'pointer' }}
                src={`data:image/jpeg;base64,${image['data']}`}
                width="215px"
                height="auto"
                alt={`image-${image['_id']}`}
              />
            </div>
          ))}
        </Grid>

        <Grid container justifyContent="center" alignItems="center">
          <Pagination
            count={Math.ceil(imagesList.length / imagesPerPage)}
            color="primary"
            showFirstButton showLastButton
            page={page}
            onChange={handleChangePage}
          />
        </Grid>

      </React.Fragment>
    </div>
  );
}

export default ImagesTable;
