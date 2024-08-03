//Enhanced with dynamic fields

import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Box,
  Chip,
  Input,
  InputAdornment,
  Rating,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { useAuth } from '../../contexts/AuthContext';
import { graphQLFetch } from "../../Api";

export default function ReviewBox({ place }) {
  const { user } = useAuth();
  const userId = user._id || user.sub;
  const placeId = place.fsq_id || place.id || place.location_id;
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const textFieldRef = useRef(null);
  const [isDisabled, setIsDisabled] = useState(false);
  // Dynamic chips for sentences and words
  // const [sentences, setSentences] = useState([
  //   "Must Visit! Awesome Place",
  //   "Can Visit Once! Good Place",
  //   "Regret Visiting! Bad Place",
  // ]);
  const [words, setWords] = useState([
    "Must Visit! Awesome Place",
    "Can Visit Once! Good Place",
    "Regret Visiting! Bad Place",
    "Awesome",
    "Good",
    "Bad",
    "Okay",
    "Pathetic",
    "Poor Service",
    "Not",
    "Really",
  ]);
  const [newChip, setNewChip] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    // To check if a review already exists and disable the form if a review exists
    const checkReviewExistence = async () => {
      const query = `
        query CheckReviewExistence($userId: ID!, $placeId: ID!) {
          checkReviewExistence(userId: $userId, placeId: $placeId) {
            exists
            rating
            reviewText
          }
        }`;

      const variables = { userId, placeId };
      const response = await graphQLFetch(query, variables);
      if (response.checkReviewExistence.exists) {
        setInputValue(response.checkReviewExistence.reviewText);
        setRating(response.checkReviewExistence.rating);
        setIsDisabled(true);
      }
    };

    checkReviewExistence();
  }, [userId, placeId]);

  const handleClickOpen = () => setOpen(true);

  const handleClose = async () => {
    if (!isDisabled) {
      // Initialize reqBody outside the if-else blocks
      function setPropertyIfDefined(obj, key, value) {
        if (value !== undefined && value !== null) {
          obj[key] = value;
        }
      }

      let reqBody = {};

      // Set common properties
      setPropertyIfDefined(reqBody, 'name', place.name);
      setPropertyIfDefined(reqBody, 'photos', place.fsq_id
        ? JSON.stringify(place?.details?.photos)
        : place.photo ? place.photo.images.large.url : "https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg"
      );
      setPropertyIfDefined(reqBody, 'rating', Number(place.fsq_id ? place?.details?.rating : place?.rating));
      setPropertyIfDefined(reqBody, 'address', place.fsq_id ? place?.details?.location?.address : place?.address);
      setPropertyIfDefined(reqBody, 'website', place.fsq_id ? place?.details?.website : place?.website);

      // Foursquare-specific properties
      if (place.fsq_id) {
        setPropertyIfDefined(reqBody, 'total_ratings', Number(place?.details?.stats?.total_ratings));
        setPropertyIfDefined(reqBody, 'price', place?.details?.price);
        setPropertyIfDefined(reqBody, 'tastes', JSON.stringify(place?.details?.tastes?.slice(0, 5)));
        setPropertyIfDefined(reqBody, 'address_extended', place?.details?.location?.address_extended);
        setPropertyIfDefined(reqBody, 'post_town', place?.location?.post_town);
        setPropertyIfDefined(reqBody, 'tel', place?.details?.tel);
      } else {
        // Properties specific to the other source
        setPropertyIfDefined(reqBody, 'num_reviews', place?.num_reviews);
        setPropertyIfDefined(reqBody, 'price_level', place?.price_level);
        setPropertyIfDefined(reqBody, 'ranking', place?.ranking);
        setPropertyIfDefined(reqBody, 'awards', JSON.stringify(place?.awards));
        setPropertyIfDefined(reqBody, 'cuisine', JSON.stringify(place?.cuisine));
        setPropertyIfDefined(reqBody, 'phone', place?.phone);
      }
      const reviewDetails = {
        userId,
        placeId,
        reviewText: inputValue,
        rating: rating,
        createdAt: new Date().toISOString(),
        placeDetails: reqBody,
      };

      const mutation = `
      mutation AddReview($reviewInput: ReviewInput!) {
        addReview(reviewInput: $reviewInput) {
          userId
          placeId
          reviewText
          rating
          createdAt
        }
      }`;
      const data = await graphQLFetch(mutation, { reviewInput: reviewDetails });
      if (data.addReview) {
        console.log("Review added successfully:", data.addReview);
      } else {
        console.error("Failed to add review");
      }
      setIsDisabled(true);
    }
    setOpen(false);
  }
  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("text/plain", item);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const item = e.dataTransfer.getData("text/plain");
    addItemToTextField(item);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleClick = (item) => {
    addItemToTextField(item);
  };

  const addItemToTextField = (item) => {
    setInputValue((prev) => (prev ? `${prev} ${item}` : item));
  };

  const handleAddChip = () => {
    if (newChip.trim()) {
      setWords((words) => [...words, newChip.trim()]);
      setNewChip("");
    }
  };

  const handleDeleteWordChip = (chipToDelete) => {
    setWords((words) => words.filter((chip) => chip !== chipToDelete));
  };


  return (
    <React.Fragment>
      <IconButton>
        <RateReviewIcon onClick={handleClickOpen} />
      </IconButton>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            minHeight: "70vh",
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle id="customized-dialog-title">
          Submit Review
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent onDrop={handleDrop} onDragOver={handleDragOver} dividers>
          <Rating
            name="rating"
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
            precision={1}
            disabled={isDisabled}
            sx={{
              marginBottom: 2, // Adjusted for layout
              // Scaling down from previously very large values for better UI
              "& .MuiRating-iconFilled": {
                transform: "scale(3)", // Scale filled icons reasonably
              },
              "& .MuiRating-iconHover": {
                transform: "scale(3)", // Scale icons on hover reasonably
              },
              "& .MuiRating-icon": {
                margin: "0 8px",
                transform: "scale(2)", // Uniform scaling for all icons
              },
            }}
          />
          <TextField
            multiline
            minRows={13}
            variant="outlined"
            placeholder="Drop items here or click items to add"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            sx={{ width: "100%", marginBottom: 2 }}
            inputRef={textFieldRef}
            disabled={isDisabled}
          />
          {!isDisabled && (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {words.map((word, index) => (
                <Chip
                  key={index}
                  label={word}
                  draggable
                  onDragStart={(e) => handleDragStart(e, word)}
                  onClick={() => handleClick(word)}
                  onDelete={() => handleDeleteWordChip(word)}
                  deleteIcon={<CancelIcon />}
                  sx={{ cursor: "pointer" }}
                />
              ))}
              <Input
                value={newChip}
                onChange={(e) => setNewChip(e.target.value)}
                placeholder="Add"
                sx={{ marginBottom: 2, width: 80 }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={handleAddChip}>
                      <AddCircleOutlineIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </Box>
          )}

        </DialogContent>
        <DialogActions>
          <Box
            sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <Button
              onClick={handleClose}
              autoFocus
              disabled={isDisabled}
              sx={{ borderRadius: "25px" }}
            >
              Submit
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
