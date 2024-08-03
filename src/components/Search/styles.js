import { styled } from "@mui/material/styles";
import { FormControl as MUIFormControl } from "@mui/material";

export const FormControl = styled(MUIFormControl)(({ theme }) => ({
  margin: theme.spacing(1),
  minWidth: "120px",
  marginBottom: "30px",
  borderRadius: "25px",
  backgroundColor: theme.palette.background.paper,
}));
