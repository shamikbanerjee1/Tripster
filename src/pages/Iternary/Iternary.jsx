import React, { useState, useRef } from "react";
import {
  Box,
  TextField,
  IconButton,
  Chip,
  Grid,
  Typography,
  Switch,
  FormControlLabel,
  Button,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Autocomplete } from "@react-google-maps/api";
import CancelIcon from "@mui/icons-material/Cancel";
import HeaderCommon from "../../components/Header/HeaderCommon";
import { useNavigate } from "react-router-dom";
import { generateItinerary } from "../../Api/index";
import LinearProgressWithLabel from "./LinearProgressWithLabel";
import { initialDays } from "../../constants/iternaryData";

const JSON5 = require("json5");

const Iternary = ({ userPreferences }) => {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [daysInput, setDaysInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const autocompleteRef = useRef(null);
  const [userPrefs, setUserPrefs] = useState("");

  const handleToggle = (event) => {
    const isChecked = event.target.checked;
    const interestsString =
      userPreferences && Object.keys(userPreferences).length > 0
        ? ". Try to include activities similar to my interests. My Interests are " +
        Object.keys(userPreferences)
          .filter((key) => userPreferences[key])
          .join(", ") +
        "."
        : "";
    setUserPrefs(isChecked ? interestsString : "");
  };

  const handleClickNew = () => {
    navigate("/app/schedule", { state: { initialDays: initialDays } });
  };
  const handleClickGenerate = async () => {
    setIsLoading(true);
    setProgress(0);

    const simulateProgress = () => {
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress >= 100 ? 100 : prevProgress + 10;
          return newProgress; //Increment progress but stop at 100%
        });
      }, 1200); // Adjust the interval as needed
      return () => clearInterval(interval);
    };

    const clearProgressInterval = simulateProgress();

    try {
      //Fetch iternary data using the GPT API based on preference and parsing
      // await new Promise((resolve) => setTimeout(resolve, 15000)); // testing purpose
      const requestString =
        places
          .map((place) => `${place.name} for ${place.days} days`)
          .join(", ") + userPrefs;
      console.log({ requestString: requestString });
      const dataString = await generateItinerary(requestString);
      setProgress(100);
      const initialDays = JSON5.parse(dataString);
      console.log({ generatedData: initialDays });
      navigate("/app/schedule", {
        state: {
          initialDays: initialDays, itineraryName: places
            .map((place) => `${place.name} for ${place.days} days`)
            .join(", ")
        }
      });
    } catch (error) {
      console.error("Error during async operation:", error);
    } finally {
      clearProgressInterval();
      setIsLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handleLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete;

    // Listen for place selection in the autocomplete component
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place && place.name) {
        setInputValue(place.name);
      }
    });
  };

  const handleAddClick = () => {
    if (inputValue && daysInput && !places.find((p) => p.name === inputValue)) {
      setPlaces([...places, { name: inputValue, days: daysInput }]);
      setInputValue("");
      setDaysInput("");
    } else {
      alert("Both place and number of days are required.");
    }
  };

  const handleDeletePlace = (placeName) => {
    setPlaces(places.filter((place) => place.name !== placeName));
  };

  return (
    <>
      <HeaderCommon />
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ paddingTop: "130px" }}
      >
        <Grid item xs={12} md={6} lg={4}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              "& > :not(style)": { m: 1 },
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "20px",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <Typography
              variant="h5"
              component="h2"
              sx={{ paddingBottom: "20px", color: "Black" }}
            >
              Iternary Generator
            </Typography>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Autocomplete
                onLoad={handleLoad}
                onPlaceChanged={() =>
                  handleLoad(autocompleteRef.current.getPlace())
                }
              >
                <TextField
                  label="Place"
                  variant="outlined"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  sx={{ width: "100%" }}
                />
              </Autocomplete>
              <TextField
                label="Days"
                type="number"
                inputProps={{ min: 1 }}
                variant="outlined"
                value={daysInput}
                onChange={(e) => setDaysInput(e.target.value)}
                sx={{ width: "15%" }}
              />
              <IconButton
                color="primary"
                onClick={handleAddClick}
                sx={{ flexShrink: 0 }}
              >
                <AddCircleIcon />
              </IconButton>
            </Box>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <FormControlLabel
                control={
                  <Switch name="userPreferences" onChange={handleToggle} />
                }
                label="User Preferences"
                sx={{ marginTop: "20px", color: "black" }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "10px",
                width: "100%",
              }}
            >
              {places.map((place, index) => (
                <Chip
                  key={index}
                  label={`${place.name} - ${place.days} days`}
                  onDelete={() => handleDeletePlace(place.name)}
                  deleteIcon={<CancelIcon />}
                />
              ))}
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                gap: 2,
                marginTop: 2,
                paddingTop: "70px",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleClickGenerate}
                disabled={places.length === 0 || isLoading}
                sx={{ flex: 1, maxWidth: "100px" }}
              >
                Generate
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleClickNew}
                sx={{ flex: 1, maxWidth: "100px" }}
              >
                New
              </Button>
            </Box>

            {isLoading && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "80%",
                  gap: 2,
                  paddingTop: "40px",
                  paddingBottom: "40px",
                }}
              >
                <LinearProgressWithLabel value={progress} />
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Iternary;
