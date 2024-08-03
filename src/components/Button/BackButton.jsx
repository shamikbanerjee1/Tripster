import React from 'react';
import IconButton from '@mui/material/IconButton';
import ArrowCircleLeftRoundedIcon from '@mui/icons-material/ArrowCircleLeftRounded';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import WestOutlinedIcon from '@mui/icons-material/WestOutlined';

const BackButton = ({ onClick }) => {
    return (
        <IconButton onClick={onClick} aria-label="back" sx={{ color: 'black', height: 48, width: 48 }}  >
            <WestOutlinedIcon sx={{ fontSize: '2rem', color: 'black' }} />
        </IconButton>
    );
};

export default BackButton;
