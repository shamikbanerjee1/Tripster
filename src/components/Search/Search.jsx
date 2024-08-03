import { InputLabel, MenuItem, Select } from "@mui/material";
import { FormControl } from "./styles";

function Search({ type, setType, rating, setRating }) {
  return (
    <div>
      <FormControl>
        <InputLabel id="type">Type</InputLabel>
        <Select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          sx={{
            minWidth: 120, // Adjust minWidth for a smaller width
            height: 40, // Adjust height to reduce size
            fontSize: "0.875rem", // Smaller font size
            "& .MuiSelect-select": {
              paddingTop: "5px", // Reduce padding to make content area smaller
              paddingBottom: "5px",
            },
            "& .MuiSvgIcon-root": {
              // Adjust icon size if necessary
              fontSize: "1.25rem",
            },
          }}
        >
          <MenuItem value="restaurants">Restaurants</MenuItem>
          <MenuItem value="hotels">Hotels</MenuItem>
          <MenuItem value="attractions">Attractions</MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel id="rating">Rating</InputLabel>
        <Select
          id="rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          sx={{
            minWidth: 120, // Adjust minWidth for a smaller width
            height: 40, // Adjust height to reduce size
            fontSize: "0.875rem", // Smaller font size
            "& .MuiSelect-select": {
              paddingTop: "5px", // Reduce padding to make content area smaller
              paddingBottom: "5px",
            },
            "& .MuiSvgIcon-root": {
              // Adjust icon size if necessary
              fontSize: "1.25rem",
            },
          }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="3">Above 3.0</MenuItem>
          <MenuItem value="4">Above 4.0</MenuItem>
          <MenuItem value="4.5">Above 4.5</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

export default Search;
