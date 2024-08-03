import React, { useState, useEffect } from "react";
import {
  CssBaseline,
  Grid,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import Header from "./Header/Header";
import List from "./List/List";
import Map from "./Map/Map";
import Search from "./Search/Search";
import SearchAdvanced from "./SearchAdvanced/SearchAdvanced";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { getPlacesData, getWeatherData, getFourSquarePlacesData, graphQLFetch } from "../Api";
import FilterChips from "./FilterChips/FilterChips";
import { useAuth } from "../contexts/AuthContext";

const MainApp = ({ categories }) => {
  const { user } = useAuth();
  const userId = user._id || user.sub;
  const [places, setPlaces] = useState([]);
  const [coordinates, setCoordinates] = useState({});
  const [bounds, setBounds] = useState({});
  const [childClicked, setChildClicked] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState("restaurants");
  const [rating, setRating] = useState("All");
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [isListCollapsed, setIsListCollapsed] = useState(true);
  const [advparams, setAdvParams] = useState({});
  const [typeAPI, setTypeAPI] = useState("tripAdviser"); //changes every time advanced parameters are set/unset
  const [scrollToPlace, setScrollToPlace] = useState(false);
  const [allFavorites, setFavorite] = useState(new Set());
  const fetchFavorites = async (userId) => {
    const query = `
      query GetFavorites($userId: ID!) {
        getFavorites(userId: $userId)
      }`;

    const variables = { userId };
    try {
      const response = await graphQLFetch(query, variables);
      if (response.getFavorites) {
        return response.getFavorites;
      }
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
    }

    return [];
  };

  const handleRemoveFilter = (key) => {
    setAdvParams((current) => {
      const updated = { ...current };
      delete updated[key];
      return updated;
    });
  };

  useEffect(() => {
    if (user) {
      const initializeFavorites = async () => {
        const favorites = await fetchFavorites(userId);
        setFavorite(new Set(favorites));
      };
      initializeFavorites();
    }
  }, [user]); // This effect depends on `user`

  //If any advanced parameters are set, then it currently sets the typeAPI to 4square
  useEffect(() => {
    const hasAdvParams = Object.keys(advparams).length !== 0;
    console.log({ hasAdvParams });
    setTypeAPI(hasAdvParams ? "4square" : "tripAdviser");
  }, [advparams]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoordinates({ lat: latitude, lng: longitude });
      }
    );
  }, []);

  useEffect(() => {
    const filteredPlaces = places.filter((place) => place.rating > rating);
    setFilteredPlaces(filteredPlaces);
  }, [rating]);


  const fetchData = () => {
    if (bounds.sw && bounds.ne) {
      setIsLoading(true);
      getWeatherData(coordinates.lat, coordinates.lng).then((data) =>
        setWeatherData(data)
      );
      if (typeAPI === "tripAdviser") {
        getPlacesData(type, bounds.sw, bounds.ne).then((data) => {
          setPlaces(
            data?.filter((place) => place.name && place.num_reviews > 0)
          );
          setIsLoading(false);
        });
      } else if (typeAPI === "4square") {
        const selectedCodes = Object.entries(advparams)
          .filter(([_, isSelected]) => isSelected)
          .map(([key]) => key.split("-")[1])
          .filter((code) => code)
        getFourSquarePlacesData(selectedCodes, bounds.sw, bounds.ne).then(
          (data) => {
            setPlaces(data);
            setIsLoading(false);
          }
        );
      }
    }
  };

  const handleGoClick = () => {
    fetchData();
    setIsListCollapsed(false);
  };

  const toggleListDisplay = () => {
    setIsListCollapsed(!isListCollapsed);
  };

  return (
    <>
      <CssBaseline />
      <Header setCoordinates={setCoordinates} />
      <Grid
        container
        justifyContent="center"
        spacing={2}
        style={{ margin: "0 0" }}
      >
        {/* Search Component */}
        <Grid item>
          <Search
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}
          />
        </Grid>

        {/* SearchAdvanced Component */}
        <Grid item style={{ paddingTop: "25px" }}>
          <SearchAdvanced
            setAdvParams={setAdvParams}
            selectedOptions={advparams}
            categories={categories}
          // userPreferences={userPreferences}
          />
        </Grid>

        {/* Go Button */}
        <Grid item style={{ paddingTop: "25px" }}>
          <Button variant="contained" color="primary" onClick={handleGoClick}>
            Go
          </Button>
        </Grid>
        <Grid item xs={12}>
          <FilterChips
            selectedFilters={advparams}
            onRemove={handleRemoveFilter}
            categories={categories}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3} style={{ width: "100%" }}>
        <Grid item xs={12} md={isListCollapsed ? 12 : 7} >
          <Map
            setCoordinates={setCoordinates}
            setBounds={setBounds}
            coordinates={coordinates}
            places={filteredPlaces.length ? filteredPlaces : places}
            setChildClicked={setChildClicked}
            weatherData={weatherData}
            setIsListCollapsed={setIsListCollapsed}
            setScrollToPlace={setScrollToPlace}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={5}
          style={{ display: isListCollapsed ? "none" : "block" }}
        >
          <Typography variant="h6" gutterBottom>
            {`${filteredPlaces.length ? filteredPlaces.length : places?.length
              } Results`}
          </Typography>
          <List
            places={filteredPlaces.length ? filteredPlaces : places}
            childClicked={childClicked}
            isLoading={isLoading}
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}
            scrollToPlace={scrollToPlace}
            setScrollToPlace={setScrollToPlace}
            allFavorites={allFavorites}
            setFavorite={setFavorite}
          />
        </Grid>
        <IconButton
          color="primary"
          aria-label="toggle list display"
          onClick={toggleListDisplay}
          sx={{
            position: "absolute",
            top: "90px",
            right: "10px", // Adjusted for visibility
            zIndex: 1000,
          }}
        >
          {isListCollapsed ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Grid>
    </>
  );
};

export default MainApp;
