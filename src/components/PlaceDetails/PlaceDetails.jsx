import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Rating,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import ReviewBox from "../ReviewBox/ReviewBox";
import ReviewsAll from "../ReviewsAll/ReviewsAll";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RateReviewIcon from "@mui/icons-material/RateReview";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import empty from "./images/empty.png";
import { useAuth } from "../../contexts/AuthContext";
import { graphQLFetch } from "../../Api";

const NextArrow = ({ onClick }) => (
  <div className="slick-next" onClick={onClick}></div>
);

// Custom Previous Arrow
const PrevArrow = ({ onClick }) => (
  <div className="slick-prev" onClick={onClick}></div>
);
const settings = {
  dots: true, // Show dot indicators
  infinite: true, // Infinite looping
  speed: 500, // Animation speed
  slidesToShow: 1, // Show one image at a time
  slidesToScroll: 1, // Scroll one image at a time
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
};
const generateImageUrl = (photo) => `${photo.prefix}original${photo.suffix}`;
// const fallbackImageUrl =
//   "https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg";

const PlaceDetails = ({
  place,
  selected,
  refProp,
  scrollToPlace,
  setScrollToPlace,
  allFavorites,
  setFavorite,
}) => {
  const { user } = useAuth();
  const userId = user._id || user.sub;
  const [isFavorite, setIsFavorite] = useState(false);
  const reqBody = {};
  function setPropertyIfDefined(obj, key, value) {
    if (value !== undefined && value !== null) {
      obj[key] = value;
    }
  }
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

  useEffect(() => {
    const placeId = place.fsq_id || place.location_id;
    console.log("my favs", allFavorites);
    setIsFavorite(allFavorites.has(placeId));
  }, [place.fsq_id, place.location_id, allFavorites]); // Add allFavorites to the dependency array

  useEffect(() => {
    if (selected && scrollToPlace) {
      refProp?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      setScrollToPlace(false); // Reset the scroll request state
    }
  }, [selected, scrollToPlace, refProp]);

  const toggleFavorite = async () => {
    const placeId = place.fsq_id || place.id || place.location_id;
    console.log(`Toggling favorite for place with id: ${placeId}`);
    const isCurrentlyFavorite = allFavorites.has(placeId);
    let mutation;
    const variables = { userId, placeId };
    if (!isCurrentlyFavorite) {
      mutation = `
        mutation AddFavorite($userId: ID!, $placeId: ID!, $placeDetails: PlaceDetailsInput!) {
          addFavorite(userId: $userId, placeId: $placeId, placeDetails: $placeDetails) {
            success
            message
          }
        }`;
      variables.placeDetails = reqBody;
    } else {
      mutation = `
        mutation RemoveFavorite($userId: ID!, $placeId: ID!) {
          removeFavorite(userId: $userId, placeId: $placeId) {
            success
            message
          }
        }`;
    }
    try {
      const response = await graphQLFetch(mutation, variables);
      console.log("GraphQL response:", response);
      if (!isCurrentlyFavorite && response.addFavorite?.success) {
        setFavorite((prevFavorites) => new Set(prevFavorites).add(placeId));
        setIsFavorite(true);
      } else if (isCurrentlyFavorite && response.removeFavorite?.success) {
        setFavorite((prevFavorites) => {
          const updatedFavorites = new Set(prevFavorites);
          updatedFavorites.delete(placeId);
          return updatedFavorites;
        });
        setIsFavorite(false);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };


  const getPriceLevelText = (priceLevel) => {
    switch (priceLevel) {
      case "$":
      case 1:
        return "Inexpensive";
      case "$$":
      case "$$$":
      case 2:
        return "Moderate";
      case 3:
      case "$$$$":
        return "Expensive";
      case 4:
        return "Very Expensive";
      default:
        return "--";
    }
  };

  return !place.fsq_id ? (
    <Card elevation={6} sx={{ marginBottom: 1 }}>
      <CardMedia
        sx={{ height: 350 }}
        image={
          place.photo
            ? place.photo.images.large.url
            : "https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg"
        }
        title={place.name}
      />
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography gutterBottom variant="h5" component="div">
            {place.name}
          </Typography>
          <Box>
            <ReviewBox place={place} />
            <ReviewsAll place={place} />
            <IconButton onClick={toggleFavorite}>
              {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
            </IconButton>
            {/* <IconButton>
              <MoreVertIcon />
            </IconButton> */}
          </Box>
        </Box>
        {/* Example of using the sx prop for conditional styling */}
        <Box sx={{ display: "flex", justifyContent: "space-between", my: 2 }}>
          <Rating name="read-only" value={Number(place.rating)} readOnly />
          <Typography component="legend">
            {place.num_reviews} review{place.num_reviews > 1 ? "s" : ""}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography component="legend">Price</Typography>
          <Typography gutterBottom variant="subtitle1">
            {getPriceLevelText(place.price_level)}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography component="legend">Ranking</Typography>
          <Typography gutterBottom variant="subtitle1">
            {place.ranking}
          </Typography>
        </Box>
        {place?.awards?.map((award, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              my: 1,
              alignItems: "center",
            }}
          >
            <img src={award.images.small} alt={award.display_name} />
            <Typography variant="subtitle2" color="textSecondary">
              {award.display_name}
            </Typography>
          </Box>
        ))}
        {place?.cuisine?.map((cuisine, i) => (
          <Chip
            key={i}
            size="small"
            label={cuisine.name}
            sx={{ mr: 0.5, mb: 0.5 }}
          />
        ))}
        {place?.address && (
          <Typography
            gutterBottom
            variant="body2"
            color="textSecondary"
            sx={{ display: "flex", alignItems: "center", mt: 2 }}
          >
            <LocationOnIcon sx={{ mr: 0.5 }} />
            {place.address}
          </Typography>
        )}
        {place.phone && (
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ display: "flex", alignItems: "center", mt: 1 }}
          >
            <PhoneIcon sx={{ mr: 0.5 }} />
            {place.phone}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button
          size="small"
          color="primary"
          onClick={() => window.open(place.web_url, "_blank")}
        >
          Trip Advisor
        </Button>
        <Button
          size="small"
          color="primary"
          onClick={() => window.open(place.website, "_blank")}
        >
          Website
        </Button>
      </CardActions>
    </Card>
  ) : (
    <Card elevation={6} sx={{ marginBottom: 2 }}>
      <style>
        {`
          .slick-next, .slick-prev {
            z-index: 1;
            top: 50%;
            width: 30px;
            height: 30px;
            transform: translate(0, -50%);
            border-radius: 15px; /* Circular appearance */
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .slick-next {
            right: -4px;
          }
          .slick-prev {
            left: -4px;
          }
        `}
      </style>
      {/* <CardMedia sx={{ height: 350 }} image={empty} title={place.name} /> */}
      {place.details.photos && place.details.photos.length > 1 ? (
        <Slider {...settings}>
          {place.details.photos.map((photo, index) => (
            <div
              key={index}
              style={{
                height: "350px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "350px",
                  width: "100%",
                  backgroundImage: `url(${generateImageUrl(photo)})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              />
            </div>
          ))}
        </Slider>
      ) : (
        <CardMedia
          sx={{ height: 350 }}
          image={
            place.details.photos[0]
              ? place.details.photos[0].prefix +
              "original" +
              place.details.photos[0].suffix
              : empty
          }
          title={place.name}
        />
      )}
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography gutterBottom variant="h5" component="div">
            {place.name}
          </Typography>
          <Box>
            <ReviewBox place={place} />
            <ReviewsAll place={place} />
            <IconButton onClick={toggleFavorite}>
              {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
            </IconButton>
            {/* <IconButton>
              <MoreVertIcon />
            </IconButton> */}
          </Box>
        </Box>
        {/* Example of using the sx prop for conditional styling */}
        <Box sx={{ display: "flex", justifyContent: "space-between", my: 2 }}>
          {place.details.rating && (
            <Rating
              name="read-only"
              value={Number(place.details.rating) / 2}
              readOnly
            />
          )}
          {place.details.stats?.total_ratings && (
            <Typography component="legend">
              {place.details.stats?.total_ratings} review
              {place.details.stats?.total_ratings > 1 ? "s" : ""}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography component="legend">Price</Typography>
          <Typography gutterBottom variant="subtitle1">
            {getPriceLevelText(place.details.price)}
          </Typography>
        </Box>
        {/* Can Implement more fields like popularity, menu, tips, tastes, etc. */}
        {/* <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography component="legend">Ranking</Typography>
          <Typography gutterBottom variant="subtitle1">
            {place.ranking}
          </Typography>
        </Box> */}
        {/* {place?.awards?.map((award, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              my: 1,
              alignItems: "center",
            }}
          >
            <img src={award.images.small} alt={award.display_name} />
            <Typography variant="subtitle2" color="textSecondary">
              {award.display_name}
            </Typography>
          </Box>
        ))} */}
        {place?.categories?.map((type, i) => (
          <Chip
            key={i}
            size="small"
            label={type.short_name} //Can put type.name as well for longer name
            sx={{ mr: 0.5, mb: 0.5 }}
          />
        ))}
        {place?.details?.tastes?.slice(0, 5).map((type, i) => (
          <Chip
            key={i}
            size="small"
            label={type} //Can put type.name as well for longer name
            sx={{ mr: 0.5, mb: 0.5 }}
          />
        ))}
        {place?.location?.address && (
          <Typography
            gutterBottom
            variant="body2"
            color="textSecondary"
            sx={{ display: "flex", alignItems: "center", mt: 2 }}
          >
            <LocationOnIcon sx={{ mr: 0.5 }} />
            {place.location.address + place.location.address_extended}
            {place.location.post_town}
          </Typography>
        )}
        {place.details.tel && (
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ display: "flex", alignItems: "center", mt: 1 }}
          >
            <PhoneIcon sx={{ mr: 0.5 }} />
            {place.details.tel}
          </Typography>
        )}
      </CardContent>
      {place.details.website && (
        <CardActions>
          <Button
            size="small"
            color="primary"
            onClick={() => window.open(place.details.website, "_blank")}
          >
            Website
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default PlaceDetails;
