import React, { useState, useEffect, createRef } from "react";
import { CircularProgress, Typography, Grid } from "@mui/material";

import PlaceDetails from "../PlaceDetails/PlaceDetails";
import { Container, Loading, ListContainer } from "./styles";

const List = ({
  places,
  childClicked,
  isLoading,
  scrollToPlace,
  setScrollToPlace,
  allFavorites,
  setFavorite,
}) => {
  const [elRefs, setElRefs] = useState([]);

  console.log({ childClicked });
  console.log({ places });

  useEffect(() => {
    const refs = Array(places?.length)
      .fill()
      .map((_, i) => elRefs[i] || createRef());

    setElRefs(refs);
  }, [places]);

  return (
    <Container>
      {/* <Typography variant="h4">Food & Dining around you</Typography> */}
      {isLoading ? (
        <Loading>
          <CircularProgress size="5rem" />
        </Loading>
      ) : (
        <>
          <ListContainer container spacing={3}>
            {places?.map((place, i) => (
              <Grid ref={elRefs[i]} key={i} item xs={12}>
                <PlaceDetails
                  selected={Number(childClicked) === i}
                  refProp={elRefs[i]}
                  place={place}
                  scrollToPlace={scrollToPlace}
                  setScrollToPlace={setScrollToPlace}
                  allFavorites={allFavorites}
                  setFavorite={setFavorite}
                />
              </Grid>
            ))}
          </ListContainer>
        </>
      )}
    </Container>
  );
};

export default List;
