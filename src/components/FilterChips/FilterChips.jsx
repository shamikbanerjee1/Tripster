import React from "react";
import { Chip, Stack } from "@mui/material";

const FilterChips = ({ selectedFilters, onRemove, categories }) => {
  console.log({ selectedFilters });
  const findCategoryNameByCode = (code) => {
    let name = "";
    Object.values(categories).forEach((category) => {
      const item = category.find((item) => item.code === code);
      if (item) name = item.name;
    });
    return name;
  };

  return (
    <Stack
      direction="row"
      spacing={1}
      justifyContent="center"
      alignItems="center"
      flexWrap="wrap" // Enable wrapping of the chips
      sx={{ gap: "10px", maxWidth: "100%", paddingBottom: "20px" }} // '10px' vertical space when wrapping
    >
      {Object.entries(selectedFilters).map(
        ([key, value]) =>
          value && (
            <Chip
              key={key}
              label={findCategoryNameByCode(key.split("-")[1])} // Assuming the key is in the format "Category-Code"
              onDelete={() => onRemove(key)}
              //   color="primary" sets the color of the chip to Black
            />
          )
      )}
    </Stack>
  );
};

export default FilterChips;
