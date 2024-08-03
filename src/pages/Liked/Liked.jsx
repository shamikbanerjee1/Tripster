import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { graphQLFetch } from '../../Api';
import HeaderCommon from '../../components/Header/HeaderCommon';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Link,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Container,
  CardMedia,
  Rating
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const NextArrow = ({ onClick }) => (
  <div className="slick-next" onClick={onClick}></div>
);


const PrevArrow = ({ onClick }) => (
  <div className="slick-prev" onClick={onClick}></div>
);

function Liked() {
  const { user } = useAuth();
  const userId = user._id || user.sub;
  const [liked, setLiked] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('All');
  const [filterOptions, setFilterOptions] = useState(new Set(['All']));
  const itemsPerPage = 6;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const generateImageUrl = (photo) => `${photo.prefix}original${photo.suffix}`;

  useEffect(() => {
    const fetchFavorites = async () => {
      const query = `
        query GetFavoritesByUserId($userId: ID!) {
          getFavoritesByUserId(userId: $userId) {
            userId
            placeId
            placeDetails {
              name
              photos
              rating
              num_reviews
              price_level
              ranking
              awards
              cuisine
              address
              phone
              website
            }
          }
        }`;
      const data = await graphQLFetch(query, { userId });
      if (data && data.getFavoritesByUserId) {
        const newData = data.getFavoritesByUserId.map(favorite => {
          let photos = [];
          try {
            photos = (favorite.placeId.length < 20) ? favorite.placeDetails.photos : JSON.parse(favorite.placeDetails.photos);
          } catch (e) {
            console.error('Failed to parse photos:', e);
          }

          const category = photos.length > 0 && photos[0].classifications ? photos[0].classifications[0] : 'Other';//maybe filter based on cuisine instead
          setFilterOptions(prev => new Set([...prev, category]));
          return {
            ...favorite,
            placeDetails: {
              ...favorite.placeDetails,
              category,
              photos,
            }
          };
        });
        console.log(newData)
        setLiked(newData);
      }
    };
    fetchFavorites();
  }, [userId]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredLiked = liked.filter(item => filter === 'All' || item.placeDetails.category === filter);

  return (
    <>
      <HeaderCommon />
      <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
        <FormControl fullWidth sx={{ maxWidth: 300, mb: 2, mx: 'auto' }}>
          <InputLabel id="filter-label">Filter by Category</InputLabel>
          <Select
            labelId="filter-label"
            value={filter}
            onChange={handleFilterChange}
            label="Filter by Category"
          >
            {[...filterOptions].map(option => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
          {filteredLiked.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(({ placeId, placeDetails }) => (
            <Card key={placeId} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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
              {placeId.length < 20 ? (
                <CardMedia
                  sx={{ height: 350 }}
                  image={
                    placeDetails.photos
                      ? placeDetails.photos
                      : "https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg"
                  }
                  title={placeDetails.name}
                />
              ) : (
                placeDetails.photos && placeDetails.photos.length > 1 ? (
                  <Slider {...settings}>
                    {placeDetails.photos.map((photo, index) => (
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
                      placeDetails.photos && placeDetails.photos.length > 0
                        ? generateImageUrl(placeDetails.photos[0])
                        : "https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg"
                    }
                    title={placeDetails.name}
                  />
                )
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" gutterBottom>{placeDetails.name}</Typography>
                {placeId.length < 20 ? (<Typography variant="body1">Rating: {placeDetails.rating}</Typography>) : (<Typography variant="body1">Rating: {placeDetails.rating / 2}</Typography>)}
                {placeId.length < 20 ? (<Rating value={Number(placeDetails.rating)} readOnly precision={0.5} style={{
                  position: "relative",
                  left: "420px",
                  bottom: "30px"
                }} />) : (<Rating value={Number(placeDetails.rating) / 2} readOnly precision={0.5} style={{
                  position: "relative",
                  left: "420px",
                  bottom: "30px"
                }} />)}
                <Typography color="textSecondary">{placeDetails.address || "No address available"}</Typography>
                {placeDetails.website && (
                  <Link href={placeDetails.website} target="_blank" rel="noopener noreferrer" color="primary">Website</Link>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
        <Pagination
          count={Math.ceil(filteredLiked.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
        />
      </Container>
    </>
  );
}

export default Liked;
