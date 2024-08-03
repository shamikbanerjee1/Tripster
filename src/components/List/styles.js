import { styled } from "@mui/material/styles";
import { FormControl as MUIFormControl, Grid } from "@mui/material";

export const Container = styled("div")(({ theme }) => ({
  padding: "25px",
}));

export const Loading = styled("div")({
  height: "600px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export const ListContainer = styled(Grid)(({ theme }) => ({
  height: "68vh",
  overflow: "auto",
}));
