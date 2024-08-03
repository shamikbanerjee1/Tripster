import React, { useState, useEffect } from "react";
import {
    Button,
    Dialog,
    DialogContent,
    DialogActions,
    IconButton,
    Box,
    Rating,
    Card,
    CardContent,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField
} from "@mui/material";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { graphQLFetch } from "../../Api";

export default function ReviewAll({ place }) {
    const placeId = place.fsq_id || place.id || place.location_id;
    const [open, setOpen] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [dateFilter, setDateFilter] = useState('');
    const [ratingFilter, setRatingFilter] = useState('');

    useEffect(() => {
        const fetchReviews = async () => {
            const query = `query GetReviewsByPlaceId($placeId: ID!) {
                getReviewsByPlaceId(placeId: $placeId) {
                  reviewText
                  rating
                  createdAt
                }
            }`;
            const variables = { placeId };
            const response = await graphQLFetch(query, variables);
            if (response.getReviewsByPlaceId) {
                setReviews(response.getReviewsByPlaceId);
            }
        };

        if (open) {
            fetchReviews();
        }
    }, [open]);

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        if (name === "dateFilter") {
            setDateFilter(value);
        } else if (name === "ratingFilter") {
            setRatingFilter(value);
        }
    };

    const applyFilters = () => {
        return reviews
            .filter(review => !ratingFilter || review.rating === parseInt(ratingFilter))
            .sort((a, b) => {
                if (dateFilter === 'recent') {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                } else if (dateFilter === 'old') {
                    return new Date(a.createdAt) - new Date(b.createdAt);
                }
                return 0;
            });
    };

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <React.Fragment>
            <IconButton onClick={handleClickOpen}>
                <FormatListBulletedIcon />
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
                <DialogContent>
                    <Box sx={{
                        width: '100%',
                        marginBottom: 2,
                        display: 'flex',
                        gap: 2,
                    }}>
                        <FormControl sx={{ width: '150px' }}>
                            <InputLabel>Date Filter</InputLabel>
                            <Select
                                value={dateFilter}
                                label="Date Filter"
                                onChange={handleFilterChange}
                                name="dateFilter"
                            >
                                <MenuItem value="">None</MenuItem>
                                <MenuItem value="recent">Most Recent</MenuItem>
                                <MenuItem value="old">Oldest First</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl sx={{ width: '150px' }}>
                            <InputLabel>Rating Filter</InputLabel>
                            <Select
                                value={ratingFilter}
                                label="Rating Filter"
                                onChange={handleFilterChange}
                                name="ratingFilter"
                            >
                                <MenuItem value="">All Ratings</MenuItem>
                                <MenuItem value="5">5 Stars</MenuItem>
                                <MenuItem value="4">4 Stars</MenuItem>
                                <MenuItem value="3">3 Stars</MenuItem>
                                <MenuItem value="2">2 Stars</MenuItem>
                                <MenuItem value="1">1 Star</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {applyFilters().length > 0 ? (
                            applyFilters().map((review, index) => (
                                <Card key={index}>
                                    <CardContent>
                                        <Typography variant="h5" component="div">
                                            {review.placeId} {/* Assuming this should be review.placeDetails.name */}
                                        </Typography>
                                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </Typography>
                                        <Typography variant="body2">
                                            {review.reviewText}
                                        </Typography>
                                        <Rating name="read-only" value={review.rating} readOnly />
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Typography sx={{ mt: 2 }} align="center">
                                No reviews available.
                            </Typography>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus sx={{ borderRadius: "25px" }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
