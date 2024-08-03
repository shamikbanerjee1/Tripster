import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Dialog, DialogContent, DialogTitle, Button, Typography, Avatar } from '@mui/material';
import { deepPurple } from '@mui/material/colors';

const Profile = ({ open, onClose }) => {
  const { user } = useAuth();

  const style = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    padding: '20px',
    backgroundColor: '#f7f7f7',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>Profile</DialogTitle>
      <DialogContent sx={{ ...style }}>
        <Avatar sx={{ bgcolor: deepPurple[500], width: 56, height: 56 }}>
          {user?.name?.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="h6">{user?.name}</Typography>
        <Typography variant="subtitle1">{user?.email}</Typography>
        {/* Other user information here */}
        <Button variant="contained" color="primary" onClick={onClose}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default Profile;
