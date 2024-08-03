import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Box } from "@mui/system";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    minWidth: "840px",
    minHeight: "500px",
  },
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
    display: "flex",
    gap: theme.spacing(2),
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
    justifyContent: "center",
  },
}));

export default function SearchAdvanced({
  setAdvParams,
  selectedOptions,
  categories,
}) {
  const [open, setOpen] = useState(false);
  const [temporarySelectedOptions, setTemporarySelectedOptions] = useState({});
  const [permanentSelectedOptions, setPermanentSelectedOptions] = useState({});
  // const [selectedCodes, setSelectedCodes] = useState("");

  useEffect(() => {
    // Initialize temporary selections to match permanent selections when dialog opens
    if (open) {
      setTemporarySelectedOptions(permanentSelectedOptions);
    }
  }, [open, permanentSelectedOptions]);

  useEffect(() => {
    // When selectedOptions changes, update temporarySelectedOptions to reflect this
    if (open) {
      setTemporarySelectedOptions(selectedOptions || {});
    }
    setTemporarySelectedOptions(selectedOptions);
  }, [open, selectedOptions]);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleSave = () => {
    // Commit temporary selections to permanent and update selectedCodes
    setPermanentSelectedOptions(temporarySelectedOptions);
    const codes = Object.entries(temporarySelectedOptions)
      .filter(([_, isSelected]) => isSelected)
      .map(([key]) => key.split("-")[1])
      .filter((code) => code) // Ensure code exists
      .join(",");
    setAdvParams(codes);
    // setSelectedCodes(codes);
    // console.log("Selected codes:", codes);
    setAdvParams(temporarySelectedOptions);
    handleClose();
  };

  const handleCheckboxChange = (category, code) => {
    const key = `${category}-${code}`;
    setTemporarySelectedOptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        <FilterAltIcon />
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Advanced Search
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          {Object.entries(categories).map(([category, options]) => (
            <Box
              key={category}
              sx={{
                width: "250px",
                borderBottom: "1px solid",
                borderColor: "divider",
                borderRadius: "25px",
                border: "1px solid",
                borderColor: "primary.main",
                p: 2,
                mb: 2,
              }}
            >
              <Typography
                gutterBottom
                component="legend"
                sx={{ mb: 1, fontWeight: "bold" }}
              >
                {category}
              </Typography>
              <FormGroup>
                {options.map((option) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          temporarySelectedOptions[
                            `${category}-${option.code}`
                          ] || false
                        }
                        onChange={() =>
                          handleCheckboxChange(category, option.code)
                        }
                        name={option.name}
                      />
                    }
                    label={option.name}
                    key={option.code}
                  />
                ))}
              </FormGroup>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSave}
            autoFocus
            sx={{
              borderRadius: "25px",
              border: "1px solid",
              borderColor: "primary.main",
            }}
          >
            Save
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
