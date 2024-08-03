import React from "react";
import GoogleMapReact from "google-map-react";
import {
  Paper,
  Typography,
  useMediaQuery,
  IconButton,
  Rating,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import ui from "./mapUI";
import {
  mapContainerStyles,
  markerContainerStyles,
  paperStyles,
  pointerStyles,
} from "./styles";

const Map = ({
  setCoordinates,
  setBounds,
  coordinates,
  places,
  setChildClicked,
  weatherData,
  setIsListCollapsed,
  setScrollToPlace,
}) => {
  const matches = useMediaQuery("(min-width:600px)");
  const API_key = "AIzaSyDxbSZfui-9zzyJjDb-7mrBYcKj-mwcuLA";

  const handleCenter = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCoordinates({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  };

  return (
    <div style={{ ...mapContainerStyles, position: "relative" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: API_key }}
        defaultCenter={coordinates}
        center={coordinates}
        defaultZoom={14}
        margin={[50, 50, 50, 50]}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: ui,
          gestureHandling: "greedy", // to enable the scroll zoom without ctrcl
        }}
        onChange={(e) => {
          setCoordinates({ lat: e.center.lat, lng: e.center.lng });
          setBounds({ ne: e.marginBounds.ne, sw: e.marginBounds.sw });
          console.log({ ne: e.marginBounds.ne, sw: e.marginBounds.sw });
        }}
        onChildClick={(child) => {
          setIsListCollapsed(false);
          setScrollToPlace(true);
          setChildClicked(child);
          // setTimeout(() => {
          //   setChildClicked(child);
          // }, 300);
        }}
      >
        {!places[0]?.fsq_id &&
          places?.map((place, i) => (
            <div
              style={markerContainerStyles}
              lat={Number(place.latitude)}
              lng={Number(place.longitude)}
              key={i}
            >
              {!matches ? (
                <LocationOnOutlinedIcon color="primary" fontSize="large" />
              ) : (
                <Paper elevation={3} style={paperStyles}>
                  <Typography variant="subtitle2" gutterBottom>
                    {place.name}
                  </Typography>
                  <img
                    style={pointerStyles}
                    src={
                      place.photo
                        ? place.photo.images.large.url
                        : "https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg"
                    }
                    alt={place.name}
                  />
                  {place.rating && (
                    <Rating
                      name="read-only"
                      size="small"
                      value={Number(place.rating)}
                      readOnly
                    />
                  )}
                </Paper>
              )}
            </div>
          ))}
        {places[0]?.fsq_id &&
          places?.map((place, i) => (
            <div
              style={markerContainerStyles}
              lat={Number(place.geocodes.main.latitude)}
              lng={Number(place.geocodes.main.longitude)}
              key={i}
            >
              {!matches ? (
                <LocationOnOutlinedIcon color="primary" fontSize="large" />
              ) : (
                <Paper elevation={3} style={paperStyles}>
                  <Typography variant="subtitle2" gutterBottom>
                    {place.name}
                  </Typography>
                  <img
                    style={pointerStyles}
                    src={
                      place.details.photos[0]
                        ? place.details.photos[0].prefix +
                        "original" +
                        place.details.photos[0].suffix
                        : "https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg"
                    }
                    alt={place.name}
                  />
                  {place.details.rating && (
                    <Rating
                      name="read-only"
                      size="small"
                      value={Number(place.details.rating) / 2}
                      readOnly
                    />
                  )}
                </Paper>
              )}
            </div>
          ))}
        {weatherData && weatherData.coord && weatherData.weather && (
          <div lat={weatherData.coord.lat} lng={weatherData.coord.lon}>
            <img
              height={100}
              src={`https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
              alt={`${weatherData.weather[0].description}`}
            />
          </div>
        )}
      </GoogleMapReact>
      <IconButton
        onClick={handleCenter}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1000,
        }}
      >
        <MyLocationIcon />
      </IconButton>
    </div>
  );
};

export default Map;
