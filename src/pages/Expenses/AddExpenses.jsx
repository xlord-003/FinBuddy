import React, { useState, useEffect, useCallback } from 'react';
import { NumericFormat } from 'react-number-format';
import { Box, Button, Grid, CircularProgress, Typography } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { doc, setDoc, getDoc } from "firebase/firestore"; // updateDoc tidak diperlukan di AddExpenses murni
import { getAuth, onAuthStateChanged } from "firebase/auth"; // onAuthStateChanged ditambahkan
import { db } from "../../firebaseConfig";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// huruf besar biar enak saja
const EXPENSE_CATEGORIES = [
    "Housing", "Food", "Transport", "Books_supplies", "Entertainment",
    "Personal_care", "Technology", "Health_wellnes", "Miscelaounus", "Tuition"
];
const MAX_WEEKS_CONST = 4; // total minggu boss
const INPUTS_PER_PAGE_CONST = 5; //kasi nilai langsung unutk total inputan per page

const Input = React.memo(({ name, label, value, onChange }) => {
    return (
        <div className="form-input">
            <label className="title-add" htmlFor={name}>{label}</label>
            <NumericFormat
                id={name}
                name={name}
                title={`${label}, week-${name.split('_').pop()}`}
                thousandSeparator="."
                decimalSeparator=","
                prefix="Rp. "
                allowNegative={false}
                value={value || ""}
                onValueChange={(values) => {
                    onChange(name, values.value);
                }}
                customInput="input"
                required
            />
        </div>
    );
});

const AddExpenses = () => {
    const [page, setPage] = useState(1);
    const [formData, setFormData] = useState({});
    const [targetWeek, setTargetWeek] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [allWeeksFilled, setAllWeeksFilled] = useState(false);
    const [existingData, setExistingData] = useState({});
    const [currentUID, setCurrentUID] = useState(null);

    const navigate = useNavigate();

    const totalPagesForCurrentWeek = Math.ceil(EXPENSE_CATEGORIES.length / INPUTS_PER_PAGE_CONST);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUID(user.uid);
            } else {
                setCurrentUID(null);
                toast.error("Your session has expired. Please login again.");
                navigate("/login"); 
                setIsLoading(false);
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const loadInitialData = useCallback(async (uid) => { 
        // cek uid
        if (!uid) {
            toast.error("User not authenticated. Please login first.");
            navigate("/login");
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        const userExpensesDocRef = doc(db, "expenses", uid);

        try {
            const docSnap = await getDoc(userExpensesDocRef);
            let currentWeekToProcess = 1;
            let fetchedData = {}; 

            if (docSnap.exists()) {
                fetchedData = docSnap.data();
                setExistingData(fetchedData);
                for (let i = 1; i <= MAX_WEEKS_CONST; i++) {
                    if (fetchedData[`week_${i}`]) {
                        currentWeekToProcess = i + 1;
                    } else {
                        break;
                    }
                }
            } else {
                setExistingData({});
            }

            if (currentWeekToProcess > MAX_WEEKS_CONST) {
                setAllWeeksFilled(true);
                setTargetWeek(MAX_WEEKS_CONST); // jika penuh maka ke minggu akhir
                setFormData({}); 
            } else {
                setTargetWeek(currentWeekToProcess);
                setAllWeeksFilled(false);
                const initialFormDataForWeek = {};
                EXPENSE_CATEGORIES.forEach(category => {
                    initialFormDataForWeek[`${category}_${currentWeekToProcess}`] = "";
                });
                setFormData(initialFormDataForWeek);
            }
        } catch (error) {
            console.error("Error fetching user expense data: ", error);
            toast.error("Failed to load expense data. Trying to start from week 1.");
            setTargetWeek(1);
            setFormData({});
            setAllWeeksFilled(false);
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        if (currentUID) {
            loadInitialData(currentUID);
        } else {
            setIsLoading(false);
            setTargetWeek(null); // kosong kalau tidak ada user
            setFormData({});
        }
    }, [currentUID, loadInitialData]);

    const handleFormDataChange = useCallback((inputName, inputValue) => {
        setFormData(prev => ({ ...prev, [inputName]: inputValue }));
    }, []);

    const renderInputs = () => {
        if (!targetWeek || allWeeksFilled || isLoading) return null;

        const startIndex = (page - 1) * INPUTS_PER_PAGE_CONST;
        const endIndex = startIndex + INPUTS_PER_PAGE_CONST;

        const allInputDefinitionsForWeek = EXPENSE_CATEGORIES.map(category => ({
            name: `${category}_${targetWeek}`,
            label: category.replace(/_/g, ' ')
        }));

        const inputsToShow = allInputDefinitionsForWeek.slice(startIndex, endIndex);

        return inputsToShow.map(({ name, label }) => (
            <Input
                key={name}
                name={name}
                label={label}
                value={formData[name]}
                onChange={handleFormDataChange}
            />
        ));
    };

    const handleSubmit = async () => {
        if (!targetWeek || isSubmitting || !currentUID) { // Cek ID
            toast.warn("Data is not ready or user is not authenticated.");
            return;
        }
        setIsSubmitting(true);

        const userExpensesDocRef = doc(db, "expenses", currentUID);

        try {
            const currentWeekPayload = {};
            EXPENSE_CATEGORIES.forEach(category => {
                currentWeekPayload[category] = parseFloat(formData[`${category}_${targetWeek}`] || 0);
            });

            const dataToSet = {
                [`week_${targetWeek}`]: currentWeekPayload
            };

            // untuk menggabungkan overall_totals

            const futureDocData = { ...existingData, ...dataToSet };

            const newOverallTotals = {};
            EXPENSE_CATEGORIES.forEach(category => {
                let sumForCategory = 0;
                for (let w = 1; w <= MAX_WEEKS_CONST; w++) {
                    if (futureDocData[`week_${w}`] && futureDocData[`week_${w}`][category] !== undefined) {
                        sumForCategory += parseFloat(futureDocData[`week_${w}`][category] || 0);
                    }
                }
                newOverallTotals[`Total_${category}`] = sumForCategory;
            });
            dataToSet.overall_totals = newOverallTotals;

            await setDoc(userExpensesDocRef, dataToSet, { merge: true });

            toast.success(`Week ${targetWeek} Expenses successfully added!`);
            navigate("/expenses");
            if (targetWeek < MAX_WEEKS_CONST) { 
                if (currentUID) loadInitialData(currentUID);
            } else {
                setAllWeeksFilled(true);
            }
            setFormData({});
            setPage(1);


        } catch (e) {
            console.error("Error saving expenses for week " + targetWeek + ": ", e);
            toast.error("Failed to save data: " + e.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // kembali
    const handlePrev = () => {
        if (page > 1) setPage((prev) => prev - 1);
    };

    // fungsi nxt
    const handleNext = () => {
        if (page < totalPagesForCurrentWeek) setPage((prev) => prev + 1);
    };

    if (isLoading || !currentUID && targetWeek === null) {
        return (
            <div className='div-add' style={{ textAlign: 'center', marginTop: '2rem' }}>
                <CircularProgress />
                <Typography sx={{ mt: 1 }}>
                    {!currentUID ? "Waiting for user authentication..." : "Loading expenditure data..."}
                </Typography>
            </div>
        );
    }

    // jika sudah penuh
    if (allWeeksFilled) {
        return (
            <div className='div-add' style={{ textAlign: 'center', marginTop: '2rem' }}>
                <Typography variant="h5" gutterBottom>
                    All expenditure data (weekly) has been recorded!
                </Typography>
                <Button variant="contained" onClick={() => navigate("/expenses")}>
                    Back to Expenses
                </Button>
            </div>
        );
    }

    // loading
    if (!targetWeek && !isLoading) {
        return (
            <div className='div-add' style={{ textAlign: 'center', marginTop: '2rem' }}>
                <Button variant="contained" sx={{ mt: 2 }} onClick={() => currentUID ? loadInitialData(currentUID) : navigate("/login")}>
                    {currentUID ? "Try Reloading" : "Back to login"}
                </Button>
            </div>
        );
    }

    return (
        <div className='div-add'>
            <Typography variant="h5" component="h2" sx={{ mb: 2, mt: 2, fontWeight: 'bold', color: 'var(--primary-font-color)' }}>
                Add New Expense
            </Typography>
            <Box sx={{
                width: { xs: '95%', sm: '90%', md: 900 },
                minHeight: 500,
                backgroundColor: 'var(--secondary-color)',
                borderRadius: '10px',
                p: { xs: 1.5, sm: 2, md: 3 },
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Grid container sx={{ justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 1 }}>
                    <Box sx={{ width: { xs: 'auto', sm: '40px' } }}>
                        <Button
                            variant="text"
                            onClick={handlePrev}
                            disabled={page === 1 || isSubmitting}
                            sx={{ minWidth: '30px', padding: '6px' }}
                        >
                            <ArrowBackRoundedIcon sx={{ width: '30px', height: '30px' }} />
                        </Button>
                    </Box>
                    <Typography variant="h6" component="h4" sx={{ fontWeight: 'bold', textAlign: 'center', flexGrow: 1, color: 'var(--primary-font-color)' }}>
                        Week {targetWeek}
                    </Typography>
                    <Box sx={{width: {xs: 'auto', sm:'40px'}}} />
                </Grid>

                <Grid container sx={{ flexGrow: 1, paddingRight: { xs: 0, sm: '1rem' }, alignItems: 'flex-start', justifyContent: 'center' }}>
                    <Grid item xs={12} sm={10} sx={{ width: { xs: '100%', sm: '81%' } }}>
                        {renderInputs()}
                    </Grid>
                </Grid>

                <Grid container sx={{ justifyContent: 'flex-end', paddingRight: { xs: '1rem', sm: '2rem', md: '5.5rem' }, mt: 1.5 }}>
                    <Box>
                        {page === totalPagesForCurrentWeek ? (
                            <Button
                                variant='contained'
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                
                            >
                                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : `Add week ${targetWeek}`}
                            </Button>
                        ) : (
                            <Button
                                variant='contained'
                                onClick={handleNext}
                                disabled={isSubmitting}
                                
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

export default AddExpenses;