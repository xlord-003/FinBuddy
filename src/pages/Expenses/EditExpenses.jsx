import React, { useState, useEffect, useCallback } from 'react';
import { NumericFormat } from 'react-number-format';
import { Box, Button, Grid, CircularProgress, Typography } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../../firebaseConfig";
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Chatbot from '../Dashboard/Chatbot';

const EXPENSE_CATEGORIES = [
    "Housing", "Food", "Transport", "Books_supplies", "Entertainment",
    "Personal_care", "Technology", "Health_wellnes", "Miscelaounus", "Tuition"
];
const MAX_WEEKS_CONST = 4; // total minggu
const INPUTS_PER_PAGE_CONST = 5; // total input per page

// Komponen Input
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


const EditExpenses = () => {
    const [page, setPage] = useState(1);
    const [formData, setFormData] = useState({});
    const [weekToEdit, setWeekToEdit] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentUID, setCurrentUID] = useState(null);
    const [existingFullData, setExistingFullData] = useState({});

    const navigate = useNavigate();
    const location = useLocation();

    const totalPagesForWeekEdit = Math.ceil(EXPENSE_CATEGORIES.length / INPUTS_PER_PAGE_CONST);

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

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const weekParam = searchParams.get('editWeek');

        if (weekParam) {
            const weekNum = parseInt(weekParam);
            if (!isNaN(weekNum) && weekNum >= 1 && weekNum <= MAX_WEEKS_CONST) {
                setWeekToEdit(weekNum);
            } else {
                toast.error("Invalid week number.");
                navigate("/expenses");
            }
        } else {
            toast.error("Week parameter to edit not found.");
            navigate("/expenses");
        }
    }, [location.search, navigate]);

    const loadExpenseDataForEdit = useCallback(async (uid, weekNum) => {
        if (!uid || !weekNum) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        try {
            const userExpensesDocRef = doc(db, "expenses", uid);
            const docSnap = await getDoc(userExpensesDocRef);

            if (docSnap.exists()) {
                const allData = docSnap.data();
                setExistingFullData(allData);

                const weekDataToLoad = allData[`week_${weekNum}`];
                if (weekDataToLoad && typeof weekDataToLoad === 'object') {
                    const initialFormData = {};
                    EXPENSE_CATEGORIES.forEach(category => {
                        const key = `${category}_${weekNum}`;
                        initialFormData[key] = weekDataToLoad[category] !== undefined ? String(weekDataToLoad[category]) : "";
                    });
                    setFormData(initialFormData);
                } else {
                    toast.warn(`Data for Week ${weekNum} not found, starting with an empty form.`);
                    const emptyFormData = {};
                    EXPENSE_CATEGORIES.forEach(category => {
                        emptyFormData[`${category}_${weekNum}`] = "";
                    });
                    setFormData(emptyFormData);
                }
            } else {
                toast.error("No expense documents were found for this user.");
                navigate("/expenses");
            }
        } catch (error) {
            console.error("Error fetching expense data for edit:", error);
            toast.error("Failed to load data for editing: " + error.message);
            navigate("/expenses");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (currentUID && weekToEdit !== null) {
            loadExpenseDataForEdit(currentUID, weekToEdit);
        } else {
            if (!currentUID && weekToEdit !== null) {
                setIsLoading(false);
            }
        }
    }, [currentUID, weekToEdit, loadExpenseDataForEdit]);

    const handleFormDataChange = useCallback((inputName, inputValue) => {
        setFormData(prev => ({ ...prev, [inputName]: inputValue }));
    }, []);

    const renderInputs = () => {
        if (!weekToEdit || isLoading) return null;

        const startIndex = (page - 1) * INPUTS_PER_PAGE_CONST;
        const endIndex = startIndex + INPUTS_PER_PAGE_CONST;

        const allInputDefinitionsForWeek = EXPENSE_CATEGORIES.map(category => ({
            name: `${category}_${weekToEdit}`,
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
        if (!weekToEdit || isSubmitting || !currentUID) {
            toast.warn("Data is not ready or is being processed. Please wait.");
            return;
        }

        setIsSubmitting(true);
        const userExpensesDocRef = doc(db, "expenses", currentUID);

        try {
            const updatedWeekPayload = {};
            EXPENSE_CATEGORIES.forEach(category => {
                updatedWeekPayload[category] = parseFloat(formData[`${category}_${weekToEdit}`] || 0);
            });

            const updatePayloadFirebase = {
                [`week_${weekToEdit}`]: updatedWeekPayload
            };

            const dataForTotalsCalculation = { ...existingFullData };
            // menimpa/tempel/ubah data minggu yang baru
            dataForTotalsCalculation[`week_${weekToEdit}`] = updatedWeekPayload;

            const newOverallTotals = {};
            EXPENSE_CATEGORIES.forEach(category => {
                let sumForCategory = 0;
                for (let w = 1; w <= MAX_WEEKS_CONST; w++) {
                    if (dataForTotalsCalculation[`week_${w}`] && dataForTotalsCalculation[`week_${w}`][category] !== undefined) {
                        sumForCategory += parseFloat(dataForTotalsCalculation[`week_${w}`][category] || 0);
                    }
                }
                newOverallTotals[`Total_${category}`] = sumForCategory;
            });
            updatePayloadFirebase.overall_totals = newOverallTotals;

            await updateDoc(userExpensesDocRef, updatePayloadFirebase);

            toast.success(`Week ${weekToEdit} Expenses successfully updated!`);
            navigate("/expenses");

        } catch (e) {
            console.error("Error updating expenses for week " + weekToEdit + ": ", e);
            toast.error("Failed to update data: " + e.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePrev = () => {
        if (page > 1) setPage(prev => prev - 1);
    };

    const handleNext = () => {
        if (page < totalPagesForWeekEdit) setPage(prev => prev + 1);
    };

    if (isLoading || !currentUID || weekToEdit === null) {
        return (
            <div className='div-add' style={{ textAlign: 'center', marginTop: '2rem' }}>
                <CircularProgress />
                <Typography sx={{ mt: 1 }}>
                    {!currentUID ? "Waiting for user authentication..." :
                        weekToEdit === null ? "Processing week parameters..." : "Loading expense data..."}
                </Typography>
            </div>
        );
    }

    return (
        <div className='div-add'>
            <Typography variant="h5" component="h2" sx={{ mb: 2, mt: 2, fontWeight: 'bold', color: 'var(--primary-font-color)' }}>
                Edit Expenses
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
                        Week {weekToEdit}
                    </Typography>
                    <Box sx={{ width: { xs: 'auto', sm: '40px' } }} />
                </Grid>

                <Grid container sx={{ flexGrow: 1, paddingRight: { xs: 0, sm: '1rem' }, alignItems: 'flex-start', justifyContent: 'center' }}>
                    <Grid item xs={12} sm={10} sx={{ width: { xs: '100%', sm: '81%' } }}>
                        {renderInputs()}
                    </Grid>
                </Grid>

                <Grid container sx={{ justifyContent: 'flex-end', paddingRight: { xs: '1rem', sm: '2rem', md: '5.5rem' }, mt: 1.5 }}>
                    <Box>
                        {page === totalPagesForWeekEdit ? (
                            <Button
                                variant='contained'
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : `Save Changes`}
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
                <Chatbot />
            </Box>
        </div>
    );
};

export default EditExpenses;