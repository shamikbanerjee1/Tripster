import React, { useState } from "react";
import { Autocomplete } from "@react-google-maps/api";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  styled,
  alpha,
  List,
  ListItem,
  ListItemText,
  Drawer,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import QuizIcon from "@mui/icons-material/Quiz";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AlignVerticalTopIcon from "@mui/icons-material/AlignVerticalTop";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Profile from "../Profile";
import Settings from "../Settings";
import Tooltip from "@mui/material/Tooltip";
import HomeIcon from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ListItemIcon from "@mui/material/ListItemIcon";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit", // Default color
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        color: "#000", // Text color black on focus
        width: "20ch",
      },
    },
  },
}));

export default function SearchAppBar({ setCoordinates }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const [autocomplete, setAutoComplete] = useState(null);
  const [isFocused, setIsFocused] = useState(false); // Track focus state
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const [isProfileDialogOpen, setProfileDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navigateToItinerary = () => {
    navigate("/app/itinerary"); // Update the route according to your app's routing structure
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const navigateToQuiz = () => {
    console.log("Quiz clicked");
    navigate("/app/quiz");
  };

  const handleMenuClick = (option) => () => {
    console.log(`${option} clicked`);
    if (option === "Profile") {
      setProfileDialogOpen(true);
    } else if (option === "Settings") {
      setSettingsDialogOpen(true);
    } else if (option === "Logout") {
      console.log("User logged out");
      logout();
      navigate("/");
    }
    handleMenuClose();
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const onLoad = (autoC) => setAutoComplete(autoC);
  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const lat = autocomplete.getPlace().geometry.location.lat();
      const lng = autocomplete.getPlace().geometry.location.lng();
      setCoordinates({ lat, lng });
    } else {
      console.log("Autocomplete is not loaded yet!");
    }
  };

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {[
          { text: "Tripster", path: "/app", icon: <HomeIcon />, color: "black" },
          { text: "Liked", path: "/app/liked", icon: <FavoriteIcon />, color: "red" },
          { text: "Reviews", path: "/app/reviews", icon: <CommentIcon />, color: "black" },
          { text: "Itineraries", path: "/app/itineraryList", icon: <ListAltIcon />, color: "black" },
        ].map((item, index) => (
          <ListItem button key={item.text} component={Link} to={item.path}>
            <ListItemIcon
              sx={{
                color: item.color ? item.color : "inherit", // Apply color from the item if specified, otherwise use inherit
              }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <AlignVerticalTopIcon sx={{ marginRight: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" }, cursor: "pointer" }}
            onClick={() => navigate("/app")}
          >
            Tripster
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ cursor: "pointer", marginRight: 2, paddingLeft: 3 }}
              onClick={() => navigate("/app/itinerary")} // Adjust the path according to your app's routing
            >
              Itinerary
            </Typography>
          </Box>
          <Tooltip title="Take a Quiz to submit preferences">
            <IconButton onClick={navigateToQuiz} sx={{ color: "white" }}>
              <QuizIcon />
            </IconButton>
          </Tooltip>
          <Search>
            <Box
              sx={{
                padding: (theme) => theme.spacing(0, 2),
                height: "100%",
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isFocused ? "#000" : "inherit",
              }}
            >
              <SearchIcon />
            </Box>
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                onFocus={() => setIsFocused(true)} // Change icon color to black when focused
                onBlur={() => setIsFocused(false)} // Revert icon color when not focused
              />
            </Autocomplete>
          </Search>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <AccountCircleIcon />
          </IconButton>
          <Menu
            id="primary-search-account-menu"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClick("Profile")}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClick("Settings")}>Settings</MenuItem>
            <MenuItem onClick={handleMenuClick("Logout")}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
      <Profile
        open={isProfileDialogOpen}
        onClose={() => setProfileDialogOpen(false)}
      />
      <Settings
        open={isSettingsDialogOpen}
        onClose={() => setSettingsDialogOpen(false)}
      />
    </Box>
  );
}
