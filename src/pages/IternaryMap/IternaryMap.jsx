import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleMapReact from 'google-map-react';
import { Paper, Typography, useMediaQuery, Button, Tooltip, Switch, FormControlLabel, Box } from '@mui/material';
import { mapContainerStyles, markerContainerStyles, paperStyles } from './styles';
import { useLocation } from 'react-router-dom';
import ui from "./mapUI";
import HeaderCommon from '../../components/Header/HeaderCommon';
import BackButton from '../../components/Button/BackButton';
import { Dialog, IconButton, DialogTitle, DialogContent, Chip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';


const IternaryMap = () => {
  const matches = useMediaQuery("(min-width:600px)");
  const location = useLocation();
  const daysData = location.state?.daysData || {};
  const naData = location.state?.naData || {};
  const [selectedDays, setSelectedDays] = useState([]);
  const [autoCenter, setAutoCenter] = useState(true);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const dayKeys = Object.keys(daysData);
    setSelectedDays(dayKeys);
  }, [daysData]);

  const API_key = 'AIzaSyDxbSZfui-9zzyJjDb-7mrBYcKj-mwcuLA';
  const [center, setCenter] = useState({ lat: 51.50363529999999, lng: -0.1267686 });
  const paperStyles = {
    padding: 10,
    margin: 'auto',
    width: matches ? 200 : 70, // Responsive width
    height: 'auto', // Auto height to accommodate text
    backgroundColor: '#f0f0f0'
  };

  const textStyle = {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
    lineHeight: '1.5em',
    height: '3em',
  };
  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    // Auto-center map based on selected days
    if (autoCenter && selectedDays.length > 0) {
      const allCoords = selectedDays.reduce((acc, day) => {
        const dayCoords = daysData[day].map(place => ({ lat: place.lat, lng: place.lng }));
        return acc.concat(dayCoords);
      }, []);

      const total = allCoords.reduce((acc, coords) => {
        acc.lat += coords.lat;
        acc.lng += coords.lng;
        return acc;
      }, { lat: 0, lng: 0 });

      if (allCoords.length > 0) {
        setCenter({
          lat: total.lat / allCoords.length,
          lng: total.lng / allCoords.length
        });
      }
    }
  }, [selectedDays, daysData]);

  const toggleDaySelection = (day) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleAutoCenterToggle = (event) => {
    setAutoCenter(event.target.checked);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };


  return (
    <>
      <HeaderCommon />
      <div style={{ ...mapContainerStyles, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 5, left: 20, zIndex: 5 }}>
          <BackButton onClick={handleBack} />
        </div>
        <div style={{ position: 'absolute', bottom: 5, left: 20, zIndex: 5 }}>
          {Object.keys(daysData).map((day) => (
            <Button
              key={day}
              style={{
                backgroundColor: selectedDays.includes(day) ? 'black' : '#e0e0e0',
                color: selectedDays.includes(day) ? 'white' : 'black',
                margin: '0 10px 10px 0'
              }}
              onClick={() => setSelectedDays(prev =>
                prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
              )}
            >
              {day}
            </Button>
          ))}
        </div>
        <div style={{ position: 'absolute', top: 5, right: 20, zIndex: 5 }}>
          <IconButton onClick={handleOpenDialog}>
            <InfoIcon />
          </IconButton>
        </div>
        <div style={{ position: 'absolute', bottom: 20, right: 40, zIndex: 5 }}>
          <FormControlLabel
            control={<Switch checked={autoCenter} onChange={(e) => setAutoCenter(e.target.checked)} />}
            label="Auto-Center"
            style={{ color: 'black', fontWeight: 'bold' }}
          />
        </div>
        <GoogleMapReact
          bootstrapURLKeys={{ key: API_key }}
          defaultCenter={center}
          center={center}
          defaultZoom={14}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            styles: ui,
            gestureHandling: 'greedy',
          }}
        >
          {selectedDays.map((day) =>
            daysData[day].map((place, index) => (
              <div
                key={index}
                lat={place.lat}
                lng={place.lng}
                style={markerContainerStyles}
              >
                <Tooltip title={<Typography>{place.content} - {place.time}</Typography>} placement="top">
                  <Paper elevation={3} style={paperStyles}>
                    <Typography variant="subtitle2" style={textStyle} gutterBottom>
                      {place.content}
                    </Typography>
                  </Paper>
                </Tooltip>
              </div>
            ))
          )}
        </GoogleMapReact>
      </div>
      <Dialog open={openDialog} onClose={handleCloseDialog} PaperProps={{
        style: {
          width: '80%',
          maxHeight: '80vh',
        }
      }}>
        <DialogTitle>{"Unavailable Data in Map"}</DialogTitle>
        <DialogContent>
          {Object.keys(naData).map(day => (
            naData[day].length > 0 && (
              <div key={day}>
                <Typography variant="h6">{day}</Typography>
                {naData[day].map((item) => (
                  <Chip key={item.id} label={`${item.content} - ${item.time}`} style={{ margin: 2 }} />
                ))}
              </div>
            )
          ))}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IternaryMap;
