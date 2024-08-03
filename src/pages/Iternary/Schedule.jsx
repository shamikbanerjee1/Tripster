
import React, { useState, useRef, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  Chip,
  Box,
  TextField,
  IconButton,
  Input,
  Container,
  Button,
  InputBase
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { styled } from "@mui/system";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import HeaderCommon from "../../components/Header/HeaderCommon";
import { useLocation } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import CustomChip from "./CustomChip";
import { useAuth } from "../../contexts/AuthContext";
import { graphQLFetch } from "../../Api";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { fetchLatLong } from "../../Api/index";
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import GoogleMapReact from 'google-map-react';
import { Autocomplete } from '@react-google-maps/api';
import PlaceIcon from '@mui/icons-material/Place';
import ui from "./../IternaryMap/mapUI";
import { getPlaceFromOnLatLng } from "../../Api/index";

const JSON5 = require("json5");

const EditableTypography = styled(Typography)({
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#efefef",
  },
});

const StyledPaper = styled(Paper)({
  padding: "20px",
  margin: "10px",
  backgroundColor: "#f0f0f0",
});

const DayHeader = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "20px",
});

const ScheduleItem = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  margin: "10px 0",
});

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  backgroundColor: "#E5E4E2",
  borderRadius: '15px',
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    borderRadius: '15px',
    [theme.breakpoints.up("sm")]: {
      width: "20ch",
      "&:focus": {
        color: "#000",
        width: "40ch",
      },
    },
  },
}));

const Marker = ({ lat, lng, isFullscreen }) => (
  <div style={{
    position: 'absolute',
    transform: isFullscreen ? 'translate(1200%, 300%)' : 'translate(30%, 80%)',
    color: 'black',
    cursor: 'pointer'
  }}>
    <PlaceIcon style={{ fontSize: 30 }} />
  </div>
);

const Schedule = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user._id || user.sub;
  const location = useLocation();
  const [mapCenter, setMapCenter] = useState({ lat: 59.95, lng: 30.33 })
  const daysData = location.state?.initialDays;
  const itineraryName = location.state?.itineraryName;
  const [scheduleId, setScheduleId] = useState(location.state?.scheduleId || null);
  console.log("Initial Days:", daysData);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [scheduleTitle, setScheduleTitle] = useState(itineraryName || "London");
  const [days, setDays] = useState(daysData);
  const [editableTimeId, setEditableTimeId] = useState(null);
  const [editTimeValue, setEditTimeValue] = useState("");
  const [showAddDay, setShowAddDay] = useState(false);
  const [inputValues, setInputValues] = useState(
    Object.keys(daysData).reduce((acc, day) => {
      acc[day] = { itemName: "", itemTime: "" };
      return acc;
    }, {})
  );

  const [editableChipId, setEditableChipId] = useState(null);
  const [editChipValue, setEditChipValue] = useState("");
  const [newDayName, setNewDayName] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [disableMapButton, setDisableMapButton] = useState(false);

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [zoom, setZoom] = useState(11);
  const mapRef = useRef(null);
  const autocompleteRef = useRef(null);
  const onLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };
  const [marker, setMarker] = useState(null);
  const [maplocation, setMapLocation] = useState({ lat: null, lng: null });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [placeName, setPlaceName] = useState("");

  useEffect(() => {
    // Add event listener to detect fullscreen change and update state
    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        setIsFullscreen(true);
      } else {
        setIsFullscreen(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    //To get the center of the Map of current Iternary
    const allCoords = Object.values(daysData).flat().reduce((acc, place) => {
      if (place.lat !== 'na' && place.lng !== 'na') {
        acc.push({ lat: parseFloat(place.lat), lng: parseFloat(place.lng) });
      }
      return acc;
    }, []);

    if (allCoords.length > 0) {
      const total = allCoords.reduce((acc, coords) => {
        acc.lat += coords.lat;
        acc.lng += coords.lng;
        return acc;
      }, { lat: 0, lng: 0 });

      setMapCenter({
        lat: total.lat / allCoords.length,
        lng: total.lng / allCoords.length
      });
    }
  }, [daysData]);

  //Filter out the places with lat and lng as 'na' and navigate to the map view
  const handleMapNavigation = () => {
    console.log("Navigating to the map view");
    const validData = {};
    const naData = {};
    Object.keys(days).forEach(day => {
      validData[day] = days[day].filter(event => event.lat !== 'na' && event.lng !== 'na');
      naData[day] = days[day].filter(event => event.lat === 'na' || event.lng === 'na');
    });
    console.log({ naData })
    navigate("/app/itineraryMap", {
      state: {
        daysData: validData, itineraryName: scheduleTitle, naData: naData
      }
    });
  };

  // Save the current schedule to the database
  const handleSaveSchedule = async () => {
    console.log("Saving the current schedule:", days);
    const scheduleDataString = JSON.stringify(days);
    const variables = {
      userId,
      name: scheduleTitle,
      scheduleData: scheduleDataString,
      ...(scheduleId && { _id: scheduleId })
    };
    const mutation = `
      mutation SaveSchedule($userId: ID!, $name: String!, $scheduleData: String!${scheduleId ? ', $_id: ID!' : ''}) {
        addOrUpdateSchedule(userId: $userId, name: $name, scheduleData: $scheduleData${scheduleId ? ', _id: $_id' : ''}) {
          success
          message
          id
        }
      }`;

    try {
      const response = await graphQLFetch(mutation, variables);
      console.log("Save response:", response);
      if (response.addOrUpdateSchedule.message) {
        setDialogMessage(scheduleTitle + response.addOrUpdateSchedule.message);
      }
      if (response.addOrUpdateSchedule.success) {
        if (!scheduleId) {
          setScheduleId(response.addOrUpdateSchedule.id);
        }
        console.log("Schedule saved successfully. ID:", response.addOrUpdateSchedule.id);
        setOpenDialog(true);
      } else {
        console.error("Failed to save the schedule:", response.addOrUpdateSchedule.message);
      }
    } catch (error) {
      console.error("Error saving the schedule:", error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // Dropped outside the list
    if (!destination) return;

    // Reordering in the same list
    if (source.droppableId === destination.droppableId) {
      const items = Array.from(days[source.droppableId]);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      setDays({
        ...days,
        [source.droppableId]: items,
      });
    } else {
      // Moving between lists
      const sourceItems = Array.from(days[source.droppableId]);
      const destItems = Array.from(days[destination.droppableId]);
      const [removed] = sourceItems.splice(source.index, 1);

      destItems.splice(destination.index, 0, removed);

      setDays({
        ...days,
        [source.droppableId]: sourceItems,
        [destination.droppableId]: destItems,
      });
    }
  };

  // Delete a day from the schedule
  const handleDeleteDay = (dayId) => {
    const { [dayId]: deletedDay, ...remainingDays } = days;
    setDays(remainingDays);
  };

  const handleChipClick = (itemId, currentContent) => {
    setEditableChipId(itemId);
    setEditChipValue(currentContent);
  };

  const handleChipSave = (dayId, itemId) => {
    const updatedItems = days[dayId].map((item) =>
      item.id === itemId ? { ...item, content: editChipValue } : item
    );
    setDays({
      ...days,
      [dayId]: updatedItems,
    });
    setEditableChipId(null);
  };

  const handleTimeDoubleClick = (itemId, currentTime) => {
    setEditableTimeId(itemId);
    setEditTimeValue(currentTime);
  };

  const handleTimeChange = (e) => {
    setEditTimeValue(e.target.value);
  };

  const handleTimeSave = (dayId) => {
    const updatedItems = days[dayId].map((item) =>
      item.id === editableTimeId ? { ...item, time: editTimeValue } : item
    );
    setDays({
      ...days,
      [dayId]: updatedItems,
    });
    setEditableTimeId(null);
  };

  const handleAddLocation = () => {
    setIsMapOpen(true);
  };


  const handleMapClose = async () => {
    const place = await getPlaceFromOnLatLng(maplocation.lat, maplocation.lng);
    setPlaceName(place);
    console.log("Place:", place);
    setIsMapOpen(false);
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current && autocompleteRef.current.getPlace().geometry) {
      const place = autocompleteRef.current.getPlace();
      const bounds = new window.google.maps.LatLngBounds();
      // Check if place has viewport, if not extend bounds around the location
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }

      setMapCenter({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      });

      // Fit the bounds in the map
      mapRef.current.fitBounds(bounds);
      mapRef.current.addListener('bounds_changed', () => {
        const newZoom = mapRef.current.getZoom();
        setZoom(newZoom);
      });
    }
  };

  const handleMapClick = ({ x, y, lat, lng, event }) => {
    setMarker({ lat, lng });
    setMapLocation({ lat, lng }); // Save clicked lat and lng to state
  };

  const clearLocation = () => {
    setMarker(null);
    setMapLocation({ lat: null, lng: null });
  };

  const handleAddItem = async (dayId) => {
    const newItem = inputValues[dayId];

    if (!newItem.itemName || !newItem.itemTime) return;


    let lat = 'na';
    let lng = 'na';
    try {
      setDisableMapButton(true);
      if (maplocation.lat && maplocation.lng) {
        lat = maplocation.lat;
        lng = maplocation.lng;
      } else {
        const data = await fetchLatLong(newItem.itemName);
        const latdata = JSON5.parse(data);
        lat = latdata.lat;
        lng = latdata.lng;
      }
    } catch (error) {
      console.log("Failed to fetch latitude and longitude from gpt-3");
    } finally {
      const newEvent = {
        id: `${dayId.toLowerCase()}-${Date.now()}`,
        content: newItem.itemName,
        time: newItem.itemTime,
        lat,
        lng
      };
      setDays(prevDays => ({
        ...prevDays,
        [dayId]: [...prevDays[dayId], newEvent],
      }));
      setInputValues(prevInputs => ({
        ...prevInputs,
        [dayId]: { itemName: "", itemTime: "" }
      }));
      setDisableMapButton(false);
      setMapLocation({ lat: null, lng: null });
      setMarker(null);
    }
  };


  const handleInputChange = (dayId, changes) => {
    setInputValues((prev) => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        ...changes,
      },
    }));
  };

  const deleteChip = (dayId, itemId) => {
    setDays({
      ...days,
      [dayId]: days[dayId].filter((item) => item.id !== itemId),
    });
  };

  const handleAddDay = () => {
    setShowAddDay((prev) => !prev);
    if (!newDayName.trim()) return;

    // Add the new day to the `days` state
    setDays({
      ...days,
      [newDayName.trim()]: [],
    });

    // Initialize `inputValues` for the new day
    setInputValues((prev) => ({
      ...prev,
      [newDayName.trim()]: { itemName: "", itemTime: "" },
    }));

    // Reset the New Day Name input field
    setNewDayName("");
  };

  return (
    <>
      <HeaderCommon />
      <Container style={{ marginTop: "30px", maxWidth: "1700px" }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%', // Full width for alignment
              cursor: 'pointer',
            }}
            onClick={() => !isEditingTitle && setIsEditingTitle(true)} // Prevent re-triggering when already editing
          >
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'center', // Center the title/input within this box
              }}
            >
              {isEditingTitle ? (
                <Input
                  value={scheduleTitle}
                  onChange={(e) => setScheduleTitle(e.target.value)}
                  onBlur={() => {
                    // Check if the title is not just whitespace before saving
                    if (scheduleTitle.trim() !== "") {
                      setIsEditingTitle(false);
                    } else {
                      // If blank or whitespace, revert to a default title or previous valid title
                      setScheduleTitle("Blank"); // Adjust as needed
                      setIsEditingTitle(false);
                    }
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      // Check similarly before saving
                      if (scheduleTitle.trim() !== "") {
                        setIsEditingTitle(false);
                      } else {
                        setScheduleTitle("Blank"); // Adjust as needed
                        setIsEditingTitle(false);
                      }
                    }
                  }}
                  autoFocus
                  sx={{
                    color: 'black',
                    fontSize: '1rem',
                    '& .MuiInputBase-input': {
                      textAlign: 'center',
                    },
                    maxWidth: '100%', // Limits the maximum width of the input
                  }}
                />
              ) : (
                <Typography
                  variant="h5"
                  sx={{
                    color: "black",
                    textAlign: "center", // Center the text within Typography
                  }}
                >
                  {scheduleTitle}
                </Typography>
              )}
            </Box>
            <Button
              disabled={disableMapButton}
              variant="contained"
              onClick={handleMapNavigation}
              sx={{
                whiteSpace: 'nowrap',
                marginLeft: 'auto',
                color: 'white',
              }}
            >
              {/* <MapIcon style={{ color: 'white' }} onClick={handleMapNavigation} />  View Map */}
              View in Map
            </Button>
          </Box>
          <Grid
            container
            justifyContent="center"
            spacing={2}
            style={{ display: "flex", flexWrap: "wrap" }}
          >
            {Object.entries(days).map(([dayId, items]) => (
              <Grid item xs={12} sm={4} key={dayId}>
                <StyledPaper>
                  <DayHeader>
                    <Typography variant="h5">{dayId}</Typography>
                    <IconButton
                      onClick={() => handleDeleteDay(dayId)}
                      size="small"
                      style={{ marginLeft: "auto" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </DayHeader>
                  <Droppable droppableId={dayId}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        {items.map((item, index) => (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(provided) => (
                              <ScheduleItem
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                {editableTimeId === item.id ? (
                                  <TextField
                                    size="small"
                                    value={editTimeValue}
                                    onChange={handleTimeChange}
                                    onBlur={() => handleTimeSave(dayId)}
                                    onKeyPress={(e) => {
                                      if (e.key === "Enter") {
                                        handleTimeSave(dayId);
                                      }
                                    }}
                                    autoFocus
                                  />
                                ) : (
                                  <EditableTypography
                                    onDoubleClick={() =>
                                      handleTimeDoubleClick(item.id, item.time)
                                    }
                                  >
                                    {item.time}
                                  </EditableTypography>
                                )}
                                {editableChipId === item.id ? (
                                  <TextField
                                    size="small"
                                    value={editChipValue}
                                    onChange={(e) =>
                                      setEditChipValue(e.target.value)
                                    }
                                    onBlur={() =>
                                      handleChipSave(dayId, item.id)
                                    }
                                    onKeyPress={(e) => {
                                      if (e.key === "Enter") {
                                        handleChipSave(dayId, item.id);
                                      }
                                    }}
                                    sx={{ width: '350px' }}
                                    autoFocus
                                  />
                                ) : (
                                  <CustomChip
                                    label={item.content}
                                    onDelete={() => deleteChip(dayId, item.id)}
                                    onDoubleClick={() =>
                                      handleChipClick(item.id, item.content)
                                    }
                                    sx={{
                                      maxWidth: "100%",
                                      "& .MuiChip-label": {
                                        display: "flex", // Make sure the label is flex so the ref div behaves correctly
                                        overflow: "hidden",
                                        whiteSpace: "nowrap",
                                        textOverflow: "ellipsis",
                                      },
                                    }}
                                  />
                                )}
                              </ScheduleItem>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </StyledPaper>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                    marginBottom: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: isFocused ? "100%" : "40%", // Expand container width when focused
                      display: "flex", // Use flex layout to put inputs side by side
                      gap: "10px", // Add gap between inputs
                      transition: "width 0.3s", // Smooth transition for width change
                    }}
                  >
                    <TextField
                      size="small"
                      value={inputValues[dayId].itemTime}
                      onChange={(e) =>
                        handleInputChange(dayId, {
                          itemTime: e.target.value.toUpperCase(),
                        })
                      }
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder="HH:MM AM/PM"
                      variant="outlined"
                      fullWidth // Make TextField take up all available space
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          fontSize: "0.875rem",
                        },
                        "& .MuiInputBase-root": {
                          fontSize: "0.7rem", // Smaller font size
                          padding: "4px 8px", // Reduced padding
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: "0.7rem", // Smaller label font size
                        },
                        "& .MuiInputBase-input": {
                          padding: "4px 8px", // Adjust input padding to make it smaller
                        },
                      }}
                    />
                    <TextField
                      size="small"
                      value={inputValues[dayId].itemName}
                      onChange={(e) =>
                        handleInputChange(dayId, { itemName: e.target.value })
                      }
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder="Add new item"
                      variant="outlined"
                      fullWidth // Make TextField take up all available space
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          fontSize: "0.875rem",
                        },
                        "& .MuiInputBase-root": {
                          fontSize: "0.7rem", // Smaller font size
                          padding: "4px 8px", // Reduced padding
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: "0.7rem", // Smaller label font size
                        },
                        "& .MuiInputBase-input": {
                          padding: "4px 8px", // Adjust input padding to make it smaller
                        },
                      }}
                    />
                  </Box>
                  <Tooltip title={marker ? placeName : "Add location"}>
                    <IconButton onClick={handleAddLocation} size="small">
                      <AddLocationAltIcon style={{ color: marker ? "black" : "" }} />
                    </IconButton>
                  </Tooltip>
                  <IconButton onClick={() => handleAddItem(dayId)} size="small">
                    <AddCircleOutlineIcon />
                  </IconButton>
                </Box>
              </Grid>
            ))}
            <Grid
              item
              xs={12}
              sm={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 200, // Ensure there's a minimum height for the centering to take effect
              }}
            >
              <IconButton
                color="primary"
                onClick={() => setShowAddDay((prev) => !prev)}
                aria-label="add new day"
                sx={{
                  height: 48,
                  width: 48,
                }}
              >
                <AddIcon />
              </IconButton>
            </Grid>

            {/* Conditional Rendering based on showAddDay state */}
            {showAddDay && (
              <Grid item xs={12} sm={4}>
                <StyledPaper>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      padding: 2,
                    }}
                  >
                    <TextField
                      label="New Day Name"
                      value={newDayName}
                      onChange={(e) => setNewDayName(e.target.value)}
                      variant="outlined"
                      fullWidth
                      sx={{ marginRight: 1 }}
                    />
                    <IconButton onClick={handleAddDay} color="primary">
                      <AddCircleOutlineIcon />
                    </IconButton>
                  </Box>
                </StyledPaper>
              </Grid>
            )}
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: 2,
              paddingBottom: 2,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveSchedule}
            >
              Save Schedule
            </Button>
          </Box>
        </DragDropContext>
      </Container>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Message"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <style>
        {`.pac-container { z-index: 4000 !important; }`}
      </style>
      {isMapOpen && (
        <Dialog
          open={isMapOpen}
          onClose={handleMapClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            style: {
              minHeight: "70vh",
              maxHeight: "90vh",
            },
          }}
        >
          <DialogContent style={{ height: '90vh', display: 'flex', flexDirection: 'column' }}>
            <Box style={{ padding: 2, zIndex: 5, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Autocomplete
                onLoad={onLoad}
                onPlaceChanged={onPlaceChanged}
              >
                <StyledInputBase
                  placeholder="Search location..."
                  InputProps={{
                    style: { color: 'black' }  // Styling the input element directly
                  }}
                />
              </Autocomplete>
            </Box>
            <div style={{ flex: 1, width: '100%', height: '100%' }}>
              <GoogleMapReact
                bootstrapURLKeys={{ key: 'AIzaSyDxbSZfui-9zzyJjDb-7mrBYcKj-mwcuLA' }}
                defaultCenter={mapCenter}
                center={mapCenter}
                defaultZoom={zoom}
                zoom={zoom}
                onChange={({ center, zoom }) => {
                  setMapCenter(center);
                  setZoom(zoom);  // Update state when user changes map zoom or center
                }}
                onClick={handleMapClick}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map }) => {
                  mapRef.current = map;
                }}
                style={{ width: '100%', height: '100%' }}
                options={{
                  disableDefaultUI: true,
                  zoomControl: true,
                  styles: ui,
                  gestureHandling: 'greedy',
                }}
              >
                {marker && <Marker lat={marker.lat} lng={marker.lng} isFullscreen={isFullscreen} />}
              </GoogleMapReact>
              <Button
                style={{
                  position: 'absolute',
                  left: 20,
                  bottom: 20,
                  zIndex: 1000  // Ensure button is above the map layers
                }}
                variant="contained"
                color="primary"
                onClick={clearLocation}
              >
                Clear
              </Button>
              <Button
                style={{
                  position: 'absolute',
                  left: 420,
                  bottom: 20,
                  zIndex: 1000  // Ensure button is above the map layers
                }}
                variant="contained"
                color="primary"
                onClick={handleMapClose}
              >
                OK
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default Schedule;
