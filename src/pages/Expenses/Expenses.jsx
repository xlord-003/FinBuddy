import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Typography, CircularProgress, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteField } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../../firebaseConfig";
import { toast } from 'react-toastify';

const Expences = () => {
    const [expenseDocData, setExpenseDocData] = useState(null);
    const [weekDataSummaries, setWeekDataSummaries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUID, setCurrentUID] = useState(null);
    const [areAllWeeksDataFilled, setAreAllWeeksDataFilled] = useState(false);
    const navigate = useNavigate();
    const maxWeeks = 4;
    const expenseCategories = [
        "Housing", "Food", "Transport", "Books_supplies", "Entertainment",
        "Personal_care", "Technology", "Health_wellnes", "Miscelaounus", "Tuition"
    ];

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUID(user.uid);
            } else {
                setCurrentUID(null);
                setIsLoading(false);
                setExpenseDocData({});
                setWeekDataSummaries([]);
                setAreAllWeeksDataFilled(false); // untuk riset jika user logout
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchExpenseData = useCallback(async (uid) => {
        if (!uid) {
            setExpenseDocData({});
            setWeekDataSummaries([]);
            setAreAllWeeksDataFilled(false);
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        try {
            const userExpensesDocRef = doc(db, "expenses", uid);
            const docSnap = await getDoc(userExpensesDocRef);
            if (docSnap.exists()) {
                setExpenseDocData(docSnap.data());
            } else {
                setExpenseDocData({});
                console.log("No expense document for this user.");
            }
        } catch (error) {
            console.error("Error fetching expense data:", error);
            toast.error("Gagal mengambil data pengeluaran.");
            setExpenseDocData({});
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (currentUID) {
            fetchExpenseData(currentUID);
        } else {
            setIsLoading(false);
            setExpenseDocData({});
            setWeekDataSummaries([]);
            setAreAllWeeksDataFilled(false);
        }
    }, [currentUID, fetchExpenseData]);

    useEffect(() => {
        if (!expenseDocData) {
            setAreAllWeeksDataFilled(false); // tidak ada data yang terisi
            return;
        }

        const summaries = [];
        let filledWeekCount = 0;
        for (let i = 1; i <= maxWeeks; i++) {
            const weekKey = `week_${i}`;
            if (expenseDocData[weekKey] && typeof expenseDocData[weekKey] === 'object') {
                let currentWeekTotal = 0;
                for (const category in expenseDocData[weekKey]) {
                    currentWeekTotal += parseFloat(expenseDocData[weekKey][category] || 0);
                }
                summaries.push({ weekNum: i, total: currentWeekTotal, hasData: true });
                filledWeekCount++;
            }
        }
        setWeekDataSummaries(summaries);
        setAreAllWeeksDataFilled(filledWeekCount === maxWeeks); // jumlah minggu dari datanya yang ada

    }, [expenseDocData]);


    const handleEdit = (weekNumber) => {
        console.log(`Edit week ${weekNumber}`);
        navigate(`/expenses/add?editWeek=${weekNumber}`);
    };

    const handleDelete = async (weekNumber) => {
        if (!currentUID) {
            toast.error("User tidak ditemukan.");
            return;
        }
        if (window.confirm(`Apakah Anda yakin ingin menghapus semua data pengeluaran untuk Minggu ${weekNumber}?`)) {
            setIsLoading(true);
            const userExpensesDocRef = doc(db, "expenses", currentUID);
            const weekKeyToDelete = `week_${weekNumber}`;

            try {
                const updatePayload = {
                    [weekKeyToDelete]: deleteField()
                };

                let currentData = expenseDocData ? { ...expenseDocData } : {};
                delete currentData[weekKeyToDelete];

                const newOverallTotals = {};
                expenseCategories.forEach(category => {
                    let sumForCategory = 0;
                    for (let w = 1; w <= maxWeeks; w++) {
                        if (w === weekNumber) continue;
                        if (currentData[`week_${w}`] && currentData[`week_${w}`][category] !== undefined) {
                            sumForCategory += parseFloat(currentData[`week_${w}`][category] || 0);
                        }
                    }
                    newOverallTotals[`Total_${category}`] = sumForCategory;
                });
                
                const remainingWeeksWithData = Object.keys(currentData).filter(key => key.startsWith('week_') && currentData[key] !== undefined);
                if (remainingWeeksWithData.length === 0) {
                    expenseCategories.forEach(category => newOverallTotals[`Total_${category}`] = 0);
                }
                updatePayload.overall_totals = newOverallTotals;

                await updateDoc(userExpensesDocRef, updatePayload);
                toast.success(`Data Minggu ${weekNumber} berhasil dihapus.`);
                fetchExpenseData(currentUID);
            } catch (error) {
                console.error(`Error deleting week ${weekNumber} data:`, error);
                toast.error(`Gagal menghapus data Minggu ${weekNumber}.`);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className='div-main'>
            <h2>Expenses Tracking</h2>
            <Box sx={{ height: '1px', width: '100%', backgroundColor: 'var(--secondary-font-color)', marginBottom: '2rem' }} />

            <Box
                sx={{
                    width: '100%',
                    height: 150,
                    borderRadius: 1,
                    bgcolor: 'var(--secondary-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'column',
                    paddingTop: '1.5rem',
                }}
            >
                <Typography variant="body1" sx={{ marginTop: '1rem', color: 'var(--primary-font-color)' }}>
                    {areAllWeeksDataFilled
                        ? "Anda telah mengisi semua data pengeluaran mingguan Anda!"
                        
                        : `Anda Belum memasukkan Pengeluaran mingguan Anda!`}
                </Typography>

                <Link to='/expenses/add' style={{ width: 'fit-content', marginTop: '1rem' }}>
                    <button className='btn-main'> Add Expences </button>
                </Link>
            </Box>

            {weekDataSummaries.length > 0 && (
                <Box
                    sx={{
                        display: 'flex', flexDirection: 'row', justifyContent: 'flex-start',
                        alignItems: 'stretch', mt: 4, gap: 2, width: '100%', flexWrap: 'wrap'
                    }}
                >
                    {weekDataSummaries.map(({ weekNum, total, hasData }) => (
                        hasData && (
                            <Paper
                                elevation={3}
                                key={weekNum}
                                sx={{
                                    flexGrow: 1,
                                    maxWidth: { xs: '100%', sm: '48%', md: '23%' },
                                    minWidth: 220,
                                    height: 240,
                                    borderRadius: '8px',
                                    backgroundColor: 'var(--secondary-color)',
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    textAlign: 'center',
                                }}
                            >
                                <Box>
                                    <Typography variant="h5" sx={{ color: 'var(--primary-font-color)', fontWeight: 'bold' }}>
                                        Minggu {weekNum}
                                    </Typography>
                                    <Typography variant="h6" sx={{ color: 'white', mt: 5, wordBreak: 'break-all' }}>
                                        Rp {total.toLocaleString('id-ID')}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2, width: '80%' }}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        color="primary" 
                                        onClick={() => handleEdit(weekNum)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleDelete(weekNum)}
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            </Paper>
                        )
                    ))}
                </Box>
            )}
            
        </div>
    );
}

export default Expences;