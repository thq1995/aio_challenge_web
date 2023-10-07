import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import { Box, Checkbox, Grid, IconButton, ImageList, ImageListItem, ImageListItemBar, Modal, Pagination, styled } from "@mui/material";
import React, { useState } from "react";
import SketchCanvas from "../SketchCanvas/SketchCanvas";
import SketchQueryField from "../SketchTextField/SketchTextField";
import ".//SketchContainer.css"
import axios from "axios";
import { createSearchParams, useNavigate } from "react-router-dom";
import FilterObjectDetection from "../FilterObjectDetection/FilterObjectDetection";



function SketchContainer({ subImages, setSubImages, selectedImages, setSelectedImages }) {
  const [imageLength, setImageLength] = useState(0);
  const [imagePerPage, setImagePerPage] = useState(32);
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedImage, setExpandedImage] = useState({});
  const [open, setOpen] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = useState(true);


  const [checkboxValues, setCheckboxValues] = useState({
    bothCheckbox: false,
    femaleCheckbox: false,
    maleCheckbox: false,
  });

  const [textFieldValues, setTextFieldValues] = useState({
    bothTextfield: 0,
    femaleTextfield: 0,
    maleTextfield: 0,
  });

  const handleCheckboxChange = (event) => {
    setCheckboxValues({
      ...checkboxValues,
      [event.target.name]: event.target.checked,
    });
  };

  const handleTextFieldChange = (event) => {
    if (!event.target.value) {
      setTextFieldValues({
        ...textFieldValues,
        [event.target.name]: 0,
      });
    } else {
      setTextFieldValues({
        ...textFieldValues,
        [event.target.name]: parseInt(event.target.value),
      });
    }
  };


  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };


  const navigate = useNavigate();

  const styledModel = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const handleClose = () => {
    setOpen(false);
    setExpandedImage({});
  }

  const [inputSketchQuery, setInputSketchQuery] = useState('');
  const [imagesList, setImagesList] = useState([]);
  const ImageListItemWithStyle = styled(ImageListItem)(({ theme }) => ({
    "&:hover": {
      cursor: "pointer",
      opacity: 0.8,
      border: `solid 5px red`,
    },
  }));

  const handleExpandImage = (imageId, filename, imageData) => {
    setOpen(true);
    setExpandedImage({ id: imageId, filename: filename, image_data: imageData });
  }

  const toggleImageSelection = (id, imageData, imageTitle) => {
    setSelectedImages((prevSelectedImages) => {
      const isSelected = prevSelectedImages.some((image) => image._id === id);

      if (isSelected) {
        // If the image with the given ID is already selected, remove it
        return prevSelectedImages.filter((image) => image._id !== id);
      } else {
        // If the image is not selected, add it

        const imgObj = {
          _id: id,
          image_data: imageData,
          filename: imageTitle
        };
        return [...prevSelectedImages, imgObj];
      }
    });
  };

  const isImageSelected = (imageId) => {
    return selectedImages.some((image) => image._id === imageId);
  };

  const fetchImageSearch = async (imageId) => {
    console.log(imageId);
    const params = { imgid: imageId }
    navigate({
      pathname: '/home/main',
      search: `?${createSearchParams(params)}`
    })

    try {
      const totalValue = parseInt(textFieldValues.bothTextfield) || 0;
      const femaleValue = parseInt(textFieldValues.femaleTextfield) || 0;
      const maleValue = parseInt(textFieldValues.maleTextfield) || 0;

      if(checkboxValues.bothCheckbox){
        if (femaleValue + maleValue <= totalValue) {
          const data = {
            checkboxes: checkboxValues,
            textfields: textFieldValues,
          };
  
          const image_response = await axios.post(
            `http://localhost:5000/home/main/imgsearch?imgid=${imageId}`, data
          );
  
  
          const sub_image_response = await axios.get(
            `http://localhost:5000/subimgsearch?imageId=${imageId}`
          )
          setImagesList(image_response.data['result']);
          setSubImages(sub_image_response.data['result']);
    
          console.log('checkdata', subImages)
          setPage(1);
        } else {
          alert('The sum of "Female" and "Male" values exceeds "Total".');
        }
      }
      else{
        const data = {
          checkboxes: checkboxValues,
          textfields: textFieldValues,
        };

        const image_response = await axios.post(
          `http://localhost:5000/home/main/imgsearch?imgid=${imageId}`, data
        );


        const sub_image_response = await axios.get(
          `http://localhost:5000/subimgsearch?imageId=${imageId}`
        )
        setImagesList(image_response.data['result']);
        setSubImages(sub_image_response.data['result']);
  
        console.log('checkdata', subImages)
        setPage(1);
      }
    } catch (error) {
      console.error('Error fetching image data:', error);
    }
  }

  return (
    <div>
      <SketchQueryField inputSketchQuery={inputSketchQuery} setInputSketchQuery={setInputSketchQuery} setIsSubmitted={setIsSubmitted} />
      <FilterObjectDetection checkboxValues={checkboxValues} textFieldValues={textFieldValues} handleCheckboxChange={handleCheckboxChange} handleTextFieldChange={handleTextFieldChange} />
      <SketchCanvas inputSketchQuery={inputSketchQuery} imagesList={imagesList} setImagesList={setImagesList} checkboxValues={checkboxValues} textFieldValues={textFieldValues} setIsSubmitted={setIsSubmitted}/>
      {
        isSubmitted? (
          <Grid container sx={{ pt: 3, overflow: 'auto' }}>
          <div style={{ maxHeight: '500px', overflow: 'auto' }}>
            {imagesList && imagesList.length > 0 ? (
              <ImageList sx={{ width: 'auto', height: 'auto' }} cols={8} rowHeight={'auto'} >
                {imagesList.map((image) => (
                  <ImageListItemWithStyle key={image["_id"]} className={`${isImageSelected(image["_id"]) ? 'selectedImage' : ''}`} >
                    <ImageListItemBar
                      title={image.filename.replace("images/keyframes/", "")}
                      position="top"
                      actionIcon={
                        <IconButton
                          aria-label={`Delete ${image.filename}`}
                          onClick={() => handleExpandImage(image._id, image.filename, image.image_data)}
                        >
                          <AspectRatioIcon sx={{ color: 'white' }} />
                        </IconButton>
                      }
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
                      alt={`not found -${image['filename']}`}
                    />
                  </ImageListItemWithStyle>
                ))}
              </ImageList>
            ) : (
              null
            )}
          </div>
        </Grid>
        ) : null
      }
    

      {Object.keys(expandedImage).length > 0 && <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >

        <Box
          sx={{
            ...styledModel,
            width: 'auto',
            height: 'auto',
          }}
        >
          <ImageListItemBar
            // title={expandedImage['filename'].replace("images/keyframes/", "")}
            position="top"
          />
          <img
            style={{ cursor: 'pointer', width: 'auto', height: 'auto' }}
            src={`data:image/jpeg;base64,${expandedImage.image_data}`}
            loading="lazy"
            alt={`not found -${expandedImage.filename}`}
          />
        </Box>
      </Modal>
      }
    </div>
  )
}

export default SketchContainer;