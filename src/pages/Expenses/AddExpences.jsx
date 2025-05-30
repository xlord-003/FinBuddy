import React, { useState, useEffect, useCallback } from 'react';
import { NumericFormat } from 'react-number-format';
import { Box, Button, Grid, CircularProgress, Typography } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firebaseConfig";
import { useNavigate } from 'react-router-dom';

const AddExpences = () => {
    const [page, setPage] = useState(1);
    const [formData, setFormData] = useState({});
    const [targetWeek, setTargetWeek] = useState(null); // week number input (1-4)
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [allWeeksFilled, setAllWeeksFilled] = useState(false);
    const [existingData, setExistingData] = useState({}); // To store already saved data

    const navigate = useNavigate();
    const maxWeeks = 4; // max week
    const inputsPerPage = 5;
    const totalPagesForCurrentWeek = 2; // 10 categori atau 5 per page

    const expenseCategories = [
        "Housing", "Food", "Transport", "Books_supplies", "Entertainment",
        "Personal_care", "Technology", "Health_wellnes", "Miscelaounus", "Tuition"
    ];

    // Fetch existing data and determine target week
    const loadInitialData = useCallback(async () => {
        setIsLoading(true);
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            alert("User is not logged in. Redirecting to login page.");
            navigate("/login"); // login route
            setIsLoading(false);
            return;
        }

        const uid = user.uid;
        const userExpensesDocRef = doc(db, "expenses", uid);

        try {
            const docSnap = await getDoc(userExpensesDocRef);
            let currentWeekToInput = 1;
            let data = {};

            if (docSnap.exists()) {
                data = docSnap.data();
                setExistingData(data);
                for (let i = 1; i <= maxWeeks; i++) {
                    if (data[`week_${i}`]) {
                        currentWeekToInput = i + 1;
                    } else {
                        break;
                    }
                }
            } else {
                setExistingData({}); 
            }

            if (currentWeekToInput > maxWeeks) {
                setAllWeeksFilled(true);
                setTargetWeek(maxWeeks);
            } else {
                setTargetWeek(currentWeekToInput);
                setAllWeeksFilled(false);
            }
        } catch (error) {
            console.error("Error fetching user expense data: ", error);
            alert("Failed to load expense data. Trying to start from week 1.");
            setTargetWeek(1);
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);


    const renderInputs = () => {
        if (!targetWeek || allWeeksFilled || isLoading) return null;

        const inputsForTargetWeek = [];
        expenseCategories.forEach(category => {
            inputsForTargetWeek.push({
                name: `${category}_${targetWeek}`,
                label: category.replace('_', ' ')
            });
        });

        const startIndex = (page - 1) * inputsPerPage;
        const endIndex = startIndex + inputsPerPage;
        const inputsToShow = inputsForTargetWeek.slice(startIndex, endIndex);

        return inputsToShow.map(({ name, label }) => (
            <Input key={name} name={name} label={label} />
        ));
    };

    //Untuk nilai rupiah
    const Input = ({ name, label }) => (
        <div className="form-input">
            <label className="title-add" htmlFor={name}>{label}</label>
            <NumericFormat
                id={name}
                name={name}
                title={`${label}, week-${name.split('_')[1]}`}
                thousandSeparator="."
                decimalSeparator=","
                prefix="Rp. "
                allowNegative={false}
                value={formData[name] || ""}
                onValueChange={(values) => {
                    const { value } = values;
                    setFormData((prev) => ({ ...prev, [name]: value }));
                }}
                customInput={inputProps => <input {...inputProps} />}
                required
            />
        </div>
    );

    const handleSubmit = async () => {
        if (!targetWeek || isSubmitting) return;
        setIsSubmitting(true);

        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
            alert("User session expired. Please log in again.");
            navigate("/login");
            setIsSubmitting(false);
            return;
        }
        const uid = user.uid;
        const userExpensesDocRef = doc(db, "expenses", uid);

        try {
            const currentWeekPayload = {};
            expenseCategories.forEach(category => {
                currentWeekPayload[category] = parseFloat(formData[`${category}_${targetWeek}`] || 0);
            });

            const dataToSet = {
                [`week_${targetWeek}`]: currentWeekPayload
            };

            let docDataBeforeUpdate = {};
            const docSnap = await getDoc(userExpensesDocRef);
            if (docSnap.exists()) {
                docDataBeforeUpdate = docSnap.data();
            }
            
            const futureDocData = { ...docDataBeforeUpdate, ...dataToSet };

            const newOverallTotals = {};
            expenseCategories.forEach(category => {
                let sumForCategory = 0;
                for (let w = 1; w <= maxWeeks; w++) {
                    if (futureDocData[`week_${w}`] && futureDocData[`week_${w}`][category] !== undefined) {
                        sumForCategory += parseFloat(futureDocData[`week_${w}`][category] || 0);
                    }
                }
                newOverallTotals[`Total_${category}`] = sumForCategory;
            });
            dataToSet.overall_totals = newOverallTotals;

            await setDoc(userExpensesDocRef, dataToSet, { merge: true });

            // console.log(`Expenses for week ${targetWeek} saved.`);
            // alert(`Weekly Expenses ${targetWeek} successfully saved!`);
            navigate("/expenses");

            setFormData({});
            setPage(1);
            setExistingData(prev => ({...prev, ...dataToSet}));

            if (targetWeek < maxWeeks) {
                setTargetWeek(prev => prev + 1);
            } else {
                setAllWeeksFilled(true);
            }
        } catch (e) {
            console.error("Error saving expenses for week " + targetWeek + ": ", e);
            alert("Failed to save data: " + e.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePrev = () => {
        if (page > 1) setPage((prev) => prev - 1);
    };

    const handleNext = () => {
        if (page < totalPagesForCurrentWeek) setPage((prev) => prev + 1);
    };

    // Untuk loading membaca data
    if (isLoading) {
        return (
            <div className='div-add' style={{ textAlign: 'center', marginTop: '2rem' }}>
                <CircularProgress />
                <Typography>Loading expense data...</Typography>
            </div>
        );
    }

    //jika sudah penuh
    if (allWeeksFilled) {
        return (
            <div className='div-add' style={{ textAlign: 'center', marginTop: '2rem' }}>
                <Typography variant="h5" gutterBottom>
                    All (weeks) expenditure data has been recorded!
                </Typography>
                <Button variant="contained" onClick={() => navigate("/expenses")}>
                    Back to Expences
                </Button>
            </div>
        );
    }
    
    if (!targetWeek) {
        return (
            <div className='div-add' style={{ textAlign: 'center', marginTop: '2rem' }}>
                <Typography>Error: Unable to specify target week.</Typography>
            </div>
        );
    }

    return (
        <div className='div-add'>
            <h2>Add New Expences</h2>
            <Box sx={{
                width: 900,
                minHeight: 500,
                backgroundColor: 'var(--secondary-color)',
                borderRadius: '10px',
                p: 2,
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Grid container sx={{ justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Button
                            variant="text"
                            onClick={handlePrev}
                            disabled={page === 1 || isSubmitting}
                        >
                            <ArrowBackRoundedIcon sx={{ width: '30px', height: '30px' }} />
                        </Button>
                    </Box>
                        <h4 style={{marginLeft: '-2rem', fontWeight: 'bold'}}>Week {targetWeek}</h4>
                        <Box></Box>
                </Grid>

                <Grid container sx={{ flexGrow: 1, paddingRight: '1rem', alignItems: 'center', justifyContent: 'center' }}>
                    <Grid item xs={10} sx={{ width: '81%' }}>
                        {renderInputs()}
                    </Grid>
                </Grid>

                <Grid container sx={{ justifyContent: 'end', paddingRight: '5.5rem', mt: 1.5 }}>
                    <Box>
                        {page === totalPagesForCurrentWeek ? (
                            <Button
                                variant='contained'
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                sx={{ alignSelf: 'flex-end' }}
                            >
                                {isSubmitting ? <CircularProgress size={24} /> : `Add week ${targetWeek}`}
                            </Button>
                        ) : (
                            <Button
                                variant='contained'
                                onClick={handleNext}
                                disabled={isSubmitting}
                                sx={{ alignSelf: 'flex-end' }}
                            >
                                Next
                            </Button>
                        )}
                    </Box>
                </Grid>
            </Box>
        </div>
    );
};

export default AddExpences;