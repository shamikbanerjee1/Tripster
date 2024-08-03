import React, { useEffect, useState } from 'react';
import HeaderCommon from '../../components/Header/HeaderCommon';
import { useAuth } from '../../contexts/AuthContext';
import { graphQLFetch } from '../../Api';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Link,
  Pagination,
  Container,
  TextField,
  CardMedia,
  Rating,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const NextArrow = ({ onClick }) => (
  <div className="slick-next" onClick={onClick}></div>
);


const PrevArrow = ({ onClick }) => (
  <div className="slick-prev" onClick={onClick}></div>
);

function UserReviews() {
  const { user } = useAuth();
  const userId = user._id || user.sub;
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [ratingFilter, setRatingFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

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
    const fetchReviews = async () => {
      const query = `
        query GetReviewsByUserId($userId: ID!) {
          getReviewsByUserId(userId: $userId) {
            userId
            placeId
            reviewText
            rating
            createdAt
            placeDetails {
              name
              photos
              website
              rating
              total_ratings
              num_reviews
              price
              price_level
              tastes
              awards
              ranking
              cuisine
              address
              address_extended
              post_town
              phone
              tel
              website
            }
          }
        }`;

      const data = await graphQLFetch(query, { userId });
      if (data && data.getReviewsByUserId) {
        const parsedReviews = data.getReviewsByUserId.map(review => {
          let photos = [];
          try {
            photos = (review.placeId.length < 20) ? review.placeDetails.photos : JSON.parse(review.placeDetails.photos);
          } catch (e) {
            console.error('Failed to parse photos:', e);
            photos = [];
          }
          return {
            ...review,
            placeDetails: {
              ...review.placeDetails,
              photos
            }
          };
        });
        console.log({ parsedReviews });
        setReviews(parsedReviews);
        setFilteredReviews(parsedReviews);
      }
    };

    fetchReviews();
  }, [userId]);

  useEffect(() => {
    const filtered = reviews.filter(review => !ratingFilter || review.rating === parseInt(ratingFilter));
    setFilteredReviews(filtered);
    setCurrentPage(1);
  }, [ratingFilter, reviews]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const handleRatingChange = (event) => {
    setRatingFilter(event.target.value);
  };

  return (
    <>
      <HeaderCommon />
      <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
        <Box sx={{
          width: '100%',
          marginBottom: 2,
          display: 'flex',
          gap: 2,
        }}>
          <FormControl sx={{ width: '150px' }}>
            <Select
              value={ratingFilter}
              onChange={handleRatingChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem value="">
                <em>All Ratings</em>
              </MenuItem>
              <MenuItem value={5}>5 Stars</MenuItem>
              <MenuItem value={4}>4 Stars</MenuItem>
              <MenuItem value={3}>3 Stars</MenuItem>
              <MenuItem value={2}>2 Stars</MenuItem>
              <MenuItem value={1}>1 Star</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {filteredReviews.length > 0 ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            {filteredReviews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((review, index) => (
              <Card key={index} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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
                {review.placeId.length < 20 ? (
                  <CardMedia
                    sx={{ height: 350 }}
                    image={
                      review.placeDetails.photos && review.placeDetails.photos.length > 0
                        ? review.placeDetails.photos
                        : "https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg"
                    }
                    title={review.placeDetails.name}
                  />
                ) : (
                  review.placeDetails.photos && review.placeDetails.photos.length > 1 ? (
                    <Slider {...settings}>
                      {review.placeDetails.photos.map((photo, index) => (
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
                        review.placeDetails.photos && review.placeDetails.photos.length > 0
                          ? generateImageUrl(review.placeDetails.photos[0])
                          : "https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg"
                      }
                      title={review.placeDetails.name}
                    />
                  )
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" gutterBottom>{review.placeDetails.name}</Typography>
                  <Typography variant="body1">Rating: {review.rating}</Typography>
                  <Rating value={Number(review.rating)} readOnly precision={0.5} style={{
                    position: "relative",
                    left: "420px",
                    bottom: "30px"
                  }} />
                  <TextField
                    label="Review"
                    multiline
                    rows={4}
                    defaultValue={review.reviewText}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Typography color="textSecondary">{review.placeDetails.address || "No address available"}</Typography>
                  {review.placeDetails.website && (
                    <Link href={review.placeDetails.website} target="_blank" rel="noopener noreferrer" color="primary">Website</Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Typography sx={{ mt: 2, textAlign: 'center', color: 'black' }}>
            No reviews available.
          </Typography>
        )}
        <Pagination
          count={Math.ceil(filteredReviews.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
        />
      </Container>
    </>
  );
}

export default UserReviews;
