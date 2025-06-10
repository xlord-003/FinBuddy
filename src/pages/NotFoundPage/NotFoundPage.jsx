import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

const NotFoundPage = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                textAlign: 'center',
            }}
        >
            <Typography variant="h1" component="h1" gutterBottom>
                404
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
                Page Not Found
            </Typography>
            <Typography variant="body1" gutterBottom>
                Sorry, the page you are looking for does not exist or has been moved.
            </Typography>
        </Box>
    );
};

export default NotFoundPage;