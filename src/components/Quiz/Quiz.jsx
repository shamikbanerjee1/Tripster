import React, { useState } from "react";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  LinearProgress,
  FormControlLabel,
  Checkbox,
  IconButton,
} from "@mui/material";
import imageLink1 from "./Images/imageLink1.jpg";
import imageLink2 from "./Images/imageLink2.jpg";
import imageLink3 from "./Images/imageLink3.jpg";
import imageLink4 from "./Images/imageLink4.jpg";
import imageLink5 from "./Images/imageLink5.jpg";
import imageLink6 from "./Images/imageLink6.jpg";
import imageLink7 from "./Images/imageLink7.png";
import imageLink8 from "./Images/imageLink8.jpg";
import imageLink9 from "./Images/imageLink9.jpg";
import imageLink10 from "./Images/imageLink10.jpg";
import imageLink11 from "./Images/imageLink11.jpg";
import imageLink12 from "./Images/imageLink12.jpg";
import { useNavigate } from "react-router-dom";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HeaderCommon from "../Header/HeaderCommon";
import { useAuth } from "../../contexts/AuthContext";
import { graphQLFetch } from "../../Api";

const imageLinks = {
  "Cultural and Historical Interests": imageLink1,
  "Entertainment and Leisure": imageLink2,
  "Wellness and Relaxation": imageLink3,
  "Sports and Recreation": imageLink4,
  "Outdoors and Nature": imageLink5,
  "Shopping Experiences": imageLink6,
  "Travel and Transportation": imageLink7,
  "Different Restaurant types and Cuisines": imageLink8,
  "Snacks, Beverage and Deserts": imageLink9,
  "Unique Dining Experiences": imageLink10,
  "Religious and Spiritual Sites": imageLink11,
  "Specialized Interest": imageLink12,
};

const Quiz = ({ categories, setUserPreferences }) => {
  const { user } = useAuth();
  const userId = user._id || user.sub;
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const itemsPerPage = 4;
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const isLastPage = currentPage === totalPages - 1;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    console.log("Selected Options:", selectedOptions);
    setIsSubmitted(true);
    console.log(selectedOptions);
    const mutation = `
    mutation addOrUpdatePreferences($userId: ID!, $preferences: String!) {
      addOrUpdatePreferences(userId: $userId, preferences: $preferences) {
        success
        message
      }
    }`;
    const variables = {
      userId,
      preferences: JSON.stringify(selectedOptions),
    };
    const response = await graphQLFetch(mutation, variables);
    if (response && response.addOrUpdatePreferences.success) {
      setUserPreferences(selectedOptions);
    }
  };

  const handleSelect = (category) => {
    setSelectedOptions((prevState) => ({
      ...prevState,
      [category]: !prevState[category],
    }));
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  const navigateBack = () => {
    navigate("/app");
  };

  const handleRetake = () => {
    setCurrentPage(0);
    setSelectedOptions({});
    setIsSubmitted(false);
  };

  const progress = ((currentPage + 1) / Math.ceil(categories.length / 4)) * 100;

  if (isSubmitted) {
    return (
      <>
        <HeaderCommon />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "80vh",
            gap: 3,
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ color: "black" }}>
            Submitted Successfully!
          </Typography>
          <Typography variant="h6" sx={{ color: "black" }}>
            Your preferences have been updated.
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Button
              onClick={navigateBack}
              startIcon={<ExitToAppIcon />}
              variant="contained"
            >
              Back to App
            </Button>
            <Button
              onClick={handleRetake}
              variant="contained"
            >
              Retake
            </Button>
          </Box>
        </Box>
      </>
    );
  }

  return (
    <>
      <HeaderCommon />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          pt: "10vh",
        }}
      >
        <Box sx={{ width: "80%", maxWidth: "lg", mx: "auto", my: 4 }}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ color: "black" }}
          >
            Describe Your Interests
          </Typography>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              my: 4,
            }}
          >
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: "10px", borderRadius: "5px", mb: 3, width: "50%" }}
            />
          </Box>

          {/* Cards grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 2,
              justifyContent: "center",
            }}
          >
            {categories
              .slice(currentPage * 4, (currentPage + 1) * 4)
              .map((category, index) => {
                const isSelected = selectedOptions[category] || false;
                return (
                  <Card key={index} sx={{ maxWidth: 345 }}>
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        height="140"
                        image={imageLinks[category]}
                        alt={category}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {category}
                        </Typography>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={isSelected}
                              onChange={() => handleSelect(category)}
                            />
                          }
                          label=""
                        />
                      </CardContent>
                    </CardActionArea>
                  </Card>
                );
              })}
          </Box>

          {/* Navigation buttons */}
          <Box
            sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 5 }}
          >
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={currentPage === 0}
            >
              Back
            </Button>
            {isLastPage ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={currentPage >= totalPages - 1}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Quiz;
