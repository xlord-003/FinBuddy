import { Box, Typography, Button, Paper, Grid, Dialog, DialogContent, DialogTitle, IconButton, styled } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from 'react';

// key
const savingOptions = [
    { id: 1, type: 'IRIT', detailsKey: 'iritSavings' },
    { id: 2, type: 'NORMAL', detailsKey: 'normalSavings' },
    { id: 3, type: 'MEWAH', detailsKey: 'mewahSavings' },
];

// masih mentahan
const dialogPopupData = {
    iritSavings: {
        title: 'IRIT',
        categories: [
            { name: 'Kebutuhan', amount: 1500000 },
            { name: 'Keinginan', amount: 500000 },
            { name: 'Tabungan', amount: 1000000 },
            { name: 'Darurat', amount: 500000 },
        ]
    },
    normalSavings: {
        title: 'NORMAL',
        categories: [
            { name: 'Kebutuhan', amount: 2000000 },
            { name: 'Keinginan', amount: 1000000 },
            { name: 'Tabungan', amount: 1500000 },
            { name: 'Darurat', amount: 1000000 },
        ]
    },
    mewahSavings: {
        title: 'MEWAH',
        categories: [
            { name: 'Kebutuhan', amount: 3000000 },
            { name: 'Keinginan', amount: 2500000 },
            { name: 'Tabungan', amount: 2000000 },
            { name: 'Darurat', amount: 1500000 },
        ]
    }
};

const StyledMaterialDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        borderRadius: '12px',
        minWidth: '300px',
        maxWidth: '600px', 
        width: '90%',
    },
}));


const SaveTips = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedDetailsKeyForDialog, setSelectedDetailsKeyForDialog] = useState(null);

    const handleCekClick = (detailsKey) => {
        setSelectedDetailsKeyForDialog(detailsKey);
        setOpenDialog(true);
    };
    // hapus key saat ditutup
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedDetailsKeyForDialog(null); 
    };

    const currentDialogData = selectedDetailsKeyForDialog ? dialogPopupData[selectedDetailsKeyForDialog] : null;

    return (
        <div className="div-main" style={{ paddingBottom: '2rem' }}>
            <h2>Saving Tips</h2>
            <Box
                sx={{
                    height: "1px",
                    width: "100%",
                    backgroundColor: "var(--secondary-font-color)",
                    marginBottom: "2rem",
                }}
            />

            <Box
                sx={{
                    bgcolor: '', width: '100%',
                }}
            >
                <Typography variant="h5" component="h2" sx={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--primary-font-color, white)', fontWeight: 'bold' }}>
                    Choose your saving options!
                </Typography>

                <Grid container spacing={10} justifyContent="center" sx={{ marginBottom: '2rem' }}> {/* Mengurangi spacing antar kartu utama */}
                    {savingOptions.map((option) => (
                        <Grid item xs={12} sm={6} md={4} key={option.id}>
                            <Paper
                                elevation={6}
                                sx={{
                                    padding: '10px 20px 10px 20px',
                                    textAlign: 'center',
                                    backgroundColor: 'var(--secondary-color)',
                                    color: 'var(--primary-font-color)', 
                                    borderRadius: '10px', 
                                    minHeight: '160px',
                                    minWidth: '200px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-around',
                                    alignItems: 'center',
                                    border: '1px solid var(--border-color)',
                                }}
                            >
                                <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '1rem', textTransform: 'uppercase' }}>
                                    {option.type}
                                </Typography>
                                <Button
                                    variant="contained"
                                    className="btn-main"
                                    onClick={() => handleCekClick(option.detailsKey)}
                                    
                                >
                                    CEK
                                </Button>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Dialog Popup */}
            {currentDialogData && (
                <StyledMaterialDialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    aria-labelledby="saving-options-dialog-title"
                    
                >
                    <DialogTitle id="saving-options-dialog-title" sx={{ paddingBottom: 1, paddingTop: 2,}}>
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                {currentDialogData.title}
                            </Typography>
                        </Box>
                            <IconButton
                                aria-label="close"
                                onClick={handleCloseDialog}
                                sx={{
                                    color: 'white',
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                    </DialogTitle>
                    <DialogContent sx={{ paddingTop: 2 }}>
                        <Grid container spacing={3} sx={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
                            {currentDialogData.categories.map((category, index) => (
                                <Grid item xs={6} key={index}>
                                    <Paper
                                        elevation={3}
                                        sx={{
                                            padding: '10px',
                                            textAlign: 'center',
                                            backgroundColor: 'var(--secondary-color)',
                                            color: 'white',
                                            borderRadius: '8px',
                                            minHeight: '170px',
                                            minWidth: '200px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-around',
                                            alignItems: 'center',
                                            border: '1px solid var(--border-color)',
                                            
                                        }}
                                    >
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                            {category.name}
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            Rp {category.amount.toLocaleString('id-ID')}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </DialogContent>
                </StyledMaterialDialog>
            )}
        </div>
    );
}

export default SaveTips;
