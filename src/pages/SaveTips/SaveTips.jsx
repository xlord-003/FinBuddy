import { Box, Typography, Button, Paper, Grid, Dialog, DialogContent, DialogTitle, IconButton, styled, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState, useEffect, useCallback } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

// Opsi save tips
const savingOptions = [
    { id: 1, type: 'ECONOMICAL', detailsKey: 'iritSavings' },
    { id: 2, type: 'NORMAL', detailsKey: 'normalSavings' },
    { id: 3, type: 'LUXURIOUS', detailsKey: 'mewahSavings' },
];

// kategori
const dialogCategories = ['Kebutuhan', 'Keinginan', 'Tabungan', 'Darurat'];

const allocationPercentages = {
    ECONOMICAL: {
        Kebutuhan: 0.60, // 60%
        Keinginan: 0.15, // 15%
        Tabungan: 0.15,  // 15%
        Darurat: 0.10,   // 10%
    },
    NORMAL: {
        Kebutuhan: 0.50, // 50%
        Keinginan: 0.30, // 30%
        Tabungan: 0.15,  // 15%
        Darurat: 0.05,   // 5%
    },
    LUXURIOUS: {
        Kebutuhan: 0.40, // 40%
        Keinginan: 0.50, // 50%
        Tabungan: 0.05,  // 5%
        Darurat: 0.05,   // 5%
    }
};

const StyledMaterialDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        backgroundColor: 'var(--primary-color, #111827)',
        color: 'var(--primary-font-color, white)',
        borderRadius: '12px',
        minWidth: '300px',
        maxWidth: '600px',
        width: '90%',
    },
}));


const SaveTips = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedOptionType, setSelectedOptionType] = useState(null);

    const [currentUID, setCurrentUID] = useState(null);
    const [currentUserBaseAmount, setCurrentUserBaseAmount] = useState(0);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [dialogDetails, setDialogDetails] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUID(user.uid);
            } else {
                setCurrentUID(null);
                setCurrentUserBaseAmount(0);
                setIsLoadingData(false);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!currentUID) {
            setCurrentUserBaseAmount(0);
            setIsLoadingData(false);
            return;
        }

        setIsLoadingData(true);
        const fetchBaseAmount = async () => {
            try {
                const incomeDocRef = doc(db, "income", currentUID);
                const docSnap = await getDoc(incomeDocRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const incomeVal = parseFloat(data.income) || 0;              // yang di ambil incomenya
                    const scholarshipVal = parseFloat(data.scholarship) || 0;    // yang di ambil scholarship
                    setCurrentUserBaseAmount(incomeVal + scholarshipVal);
                } else {
                    console.log("Income document not found for user:", currentUID);
                    setCurrentUserBaseAmount(0);
                }
            } catch (error) {
                console.error("Error retrieving income data:", error);
                setCurrentUserBaseAmount(0);
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchBaseAmount();
    }, [currentUID]);

    useEffect(() => {
        if (selectedOptionType && currentUserBaseAmount !== null && allocationPercentages[selectedOptionType]) {
            const percentages = allocationPercentages[selectedOptionType];

            const categoriesData = dialogCategories.map(catName => {
                const percentage = percentages[catName] || 0;
                const calculatedAmount = currentUserBaseAmount * percentage;
                return {
                    name: catName,
                    amount: calculatedAmount
                };
            });

            setDialogDetails({
                title: `${selectedOptionType}`,
                categories: categoriesData,
            });
        } else {
            setDialogDetails(null);
        }
    }, [selectedOptionType, currentUserBaseAmount]);


    const handleCekClick = (optionType) => {
        setSelectedOptionType(optionType);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedOptionType(null);
    };

    return (
        <div className="div-main" style={{ paddingBottom: '2rem' }}>
            <h2>Saving Tips</h2>
            <Box
                sx={{
                    height: "1px",
                    width: "100%",
                    backgroundColor: "var(--secondary-font-color, #9CA3AF)",
                    marginBottom: "2rem",
                }}
            />

            <Box sx={{ width: '100%', }}>
                {isLoadingData ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                        <CircularProgress/>
                    </Box>
                ) : (
                    <Grid container spacing={3} justifyContent="center" sx={{ marginBottom: '2rem', gap: '5rem' }}>
                        {savingOptions.map((option) => (
                            <Grid item xs={12} sm={6} md={4} key={option.id}>
                                <Paper
                                    elevation={6}
                                    sx={{
                                        padding: '25px 20px',
                                        textAlign: 'center',
                                        backgroundColor: 'var(--secondary-color)',
                                        color: 'white',
                                        borderRadius: 2,
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
                                        onClick={() => handleCekClick(option.type)}
                                        sx={{
                                            
                                            color: 'white',
                                            padding: '8px 30px',
                                            borderRadius: '6px',
                                            fontWeight: 'bold',
                                            width: { xs: '80%', sm: '60%' },
                                            minWidth: '100px',
                                        }}
                                    >
                                        CEK
                                    </Button>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
            {/* Untuk PopUp */}
            {dialogDetails && (
                <StyledMaterialDialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    aria-labelledby="saving-options-dialog-title"
                >
                    <DialogTitle id="saving-options-dialog-title" sx={{ paddingBottom: 1, paddingTop: 2, }}>
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                {dialogDetails.title}
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
                            {dialogDetails.categories.map((category, index) => (
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
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '20px', marginTop: '-1rem' }}>
                                            {category.name}
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: '0rem' }}>
                                            Rp {Math.round(category.amount).toLocaleString('id-ID')} {/* Pembulatan dan format */}
                                        </Typography>
                                        <Box></Box>
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
