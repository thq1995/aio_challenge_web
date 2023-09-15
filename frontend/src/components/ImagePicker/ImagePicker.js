import { Button, IconButton, ImageList, ImageListItem, ImageListItemBar, styled } from "@mui/material";
import React from "react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DeleteIcon from '@mui/icons-material/Delete';



const ImageListItemWithStyle = styled(ImageListItem)(({ theme }) => ({
  "&:hover": {
    cursor: "pointer",
    opacity: 0.8,
  },
}));

function ImagePicker({ selectedImages, setSelectedImages }) {
  console.log('image-picker-images', selectedImages)

  const handlingSubmission = () => {
    if (selectedImages === 0) {
      alert('Please select images before submission')
    }
    else {

      const customColumnNames = {
        video: 'Video',
        frameId: 'Frame idx',
      };
      const csvContent = convertArrayToCSV(selectedImages, customColumnNames);

      // Create a Blob containing the CSV data
      const blob = new Blob([csvContent], { type: 'text/csv' });

      // Create a URL for the Blob
      const url = window.URL.createObjectURL(blob);

      // Create a link element for the download
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Submission.csv';

      // Trigger the download
      link.click();

      // Clean up
      window.URL.revokeObjectURL(url);
    }
  }

  const convertArrayToCSV = (array, columnNames) => {
    // Extract the desired properties based on custom column names
    const csvData = array.map((row, index) => ({
      [columnNames.video]: row.filename.split("/")[0],
      [columnNames.frameId]: row.filename.split("/")[1].replace(".jpg", "")
    }));

    // Create the CSV header based on custom column names
    // const header = `${columnNames.video},${columnNames.frameId}\n`;

    // Convert the extracted data to CSV format
    const csv = csvData.map((row) =>
      Object.values(row)
        .map((value) => (typeof value === 'string' ? `"${value}"` : value))
        .join(',')
    );

    return csv.join('\n');
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    console.log(result)
    const items = [...selectedImages];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSelectedImages(items);
  };

  const handleDeleteImage = (imageId) => {
    const updatedSelectedImages = selectedImages.filter((image) => image._id !== imageId);
    setSelectedImages(updatedSelectedImages);
  };


  if (selectedImages !== undefined) {
    return (
      <React.Fragment>
        <h3>Image Submission Sites</h3>
        <Button variant="contained" onClick={handlingSubmission}>
          Download CSV
        </Button>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="selectedImages">
            {(provided) => (
              <ImageList
                sx={{ width: 'auto', height: 'auto' }}
                cols={5}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {selectedImages.map((image, index) => (
                  <Draggable key={image['_id']} draggableId={String(image['_id'])} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <ImageListItemWithStyle key={image['_id']}>
                          <ImageListItemBar
                            title={image.filename}
                            position="top"
                            actionIcon={
                              <IconButton
                                aria-label={`Delete ${image.filename}`}
                                onClick={() => handleDeleteImage(image._id)}
                              >
                                <DeleteIcon sx={{ color: 'white' }}/>
                              </IconButton>
                            }
                          />
                          <img
                            src={`data:image/jpeg;base64,${image['image_data']}`}
                            srcSet={`data:image/jpeg;base64,${image['image_data']}`}
                            alt={image._id}
                            loading="lazy"
                          />
                        </ImageListItemWithStyle>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ImageList>
            )}
          </Droppable>
        </DragDropContext>
      </React.Fragment>
    );
  }
}

export default ImagePicker;