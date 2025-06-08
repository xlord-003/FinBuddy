import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Paper, Grid, CircularProgress, circularProgressClasses } from '@mui/material';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// kartu (4 kotak atas)
const SummaryCard = ({ title, value, isLoading }) => (
    <Paper
        elevation={4}
        sx={{
            p: 2,
            backgroundColor: 'var(--secondary-color)',
            color: 'white',
            borderRadius: '10px',
            minHeight: '120px',
            minWidth: '260px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'start',
            gap: 3,
        }}
    >
        <Typography variant="body1" sx={{ color: 'var(--secondary-font-color)' }}>
            {title}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {isLoading ? <CircularProgress /> : value}
        </Typography>
    </Paper>
);


const Dashboard = () => {

    const [userName, setUserName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [currentUID, setCurrentUID] = useState(null);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [balance, setBalance] = useState(0);
    const [scholarship, setScholarship] = useState(0);

    // grafik
    const [lineChartData, setLineChartData] = useState([]);
    const [pieChartData, setPieChartData] = useState([]);
    const [yAxisMax, setYAxisMax] = useState(500000); // dta default untuk y

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUID(user.uid);
            } else {
                setCurrentUID(null);
                setIsLoading(false);
                setUserName('');
                setScholarship(0);
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchDashboardData = useCallback(async (uid) => {
        setIsLoading(true);
        try {
            const userDocRef = doc(db, 'users', uid);
            const incomeDocRef = doc(db, 'income', uid);
            const expensesDocRef = doc(db, 'expenses', uid);

            const [userDocSnap, incomeDocSnap, expensesDocSnap] = await Promise.all([
                getDoc(userDocRef),
                getDoc(incomeDocRef),
                getDoc(expensesDocRef)
            ]);

            setUserName(userDocSnap.exists() ? userDocSnap.data().username || 'Username' : 'Username');

            // --- Income ---
            let calculatedTotalIncome = 0;
            let scholarshipAmount =0 ;
            if (incomeDocSnap.exists()) {
                const incomeData = incomeDocSnap.data();
                scholarshipAmount = parseFloat(incomeData.scholarship) || 0;
                calculatedTotalIncome =
                    (parseFloat(incomeData.income) || 0) +
                    (parseFloat(incomeData.scholarship) || 0) +
                    (parseFloat(incomeData.tuition_fee) || 0);
            }
            setTotalIncome(calculatedTotalIncome);
            setScholarship(scholarshipAmount);
            const weeklyIncome = calculatedTotalIncome / 4; // total income di bagi 4 karena ada 4 minggu

            // --- Expenses ---
            let calculatedTotalExpenses = 0;
            const weeklyExpenses = [0, 0, 0, 0];
            let maxWeeklyValue = weeklyIncome;

            if (expensesDocSnap.exists()) {
                const expensesData = expensesDocSnap.data();

                // Kalkulasi untuk Line Chart
                for (let i = 1; i <= 4; i++) {
                    const weekKey = `week_${i}`;
                    if (expensesData[weekKey] && typeof expensesData[weekKey] === 'object') {
                        const weeklyTotal = Object.values(expensesData[weekKey])
                            .reduce((sum, current) => sum + (parseFloat(current) || 0), 0);
                        weeklyExpenses[i - 1] = weeklyTotal;
                        if (weeklyTotal > maxWeeklyValue) maxWeeklyValue = weeklyTotal;
                    }
                }

                // menghitung data unutk grafik
                if (expensesData.overall_totals && typeof expensesData.overall_totals === 'object') {
                    const totals = expensesData.overall_totals;
                    calculatedTotalExpenses = Object.values(totals)
                        .reduce((sum, current) => sum + (parseFloat(current) || 0), 0);

                    if (calculatedTotalExpenses > 0) {
                        const processedForPie = Object.entries(totals)
                            .map(([key, value]) => ({
                                name: key.replace('Total_', '').replace(/_/g, ' '),
                                value: parseFloat(value) || 0,
                            }))
                            .sort((a, b) => b.value - a.value);

                        const topN = 3;
                        let finalPieData = [];
                        if (processedForPie.length > topN) {
                            finalPieData = processedForPie.slice(0, topN);
                            const othersValue = processedForPie.slice(topN).reduce((sum, item) => sum + item.value, 0);
                            if (othersValue > 0) finalPieData.push({ name: 'Others', value: othersValue });
                        } else {
                            finalPieData = processedForPie.filter(item => item.value > 0);
                        }

                        setPieChartData(finalPieData.map(item => ({
                            ...item,
                            displayName: `${item.name} (${((item.value / calculatedTotalExpenses) * 100).toFixed(0)}%) `
                        })));
                    } else {
                        setPieChartData([]);
                    }
                } else {
                    setPieChartData([]);
                }
            }
            setTotalExpenses(calculatedTotalExpenses);
            setBalance(calculatedTotalIncome - calculatedTotalExpenses);

            // data untuk batas Y dan X
            setYAxisMax(Math.ceil(maxWeeklyValue + 500000));
            setLineChartData([
                { week: 'Week 1', Income: weeklyIncome, Expenses: weeklyExpenses[0] },
                { week: 'Week 2', Income: weeklyIncome, Expenses: weeklyExpenses[1] },
                { week: 'Week 3', Income: weeklyIncome, Expenses: weeklyExpenses[2] },
                { week: 'Week 4', Income: weeklyIncome, Expenses: weeklyExpenses[3] },
            ]);

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (currentUID) {
            fetchDashboardData(currentUID);
        }
    }, [currentUID, fetchDashboardData]);

    const CustomTooltip = ({ active, payload, label }) => { // keterangan piechart
        if (active && payload && payload.length) {
            return (
                <div
                    style={{
                        backgroundColor: 'var(--primary-color)',
                        padding: '10px 15px',
                        border: '1px solid var(--border-color)',
                        color: 'var(--primary-font-color)'
                    }}
                >
                    {payload.map((pld, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                            <p style={{ margin: 0 }}>{`${pld.name} : ${formatToRupiah(pld.value)}`}</p>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };


    const formatToRupiah = (number) => {
        if (typeof number !== 'number') return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency', currency: 'IDR', minimumFractionDigits: 0
        }).format(number);
    };

    const yAxisFormatter = (value) => {
        if (value >= 1000000) return `${value / 1000000} M`;
        if (value >= 1000) return `${value / 1000} K`;
        return value;
    };

    const PIE_CHART_COLORS = ['#6A0DAD', '#9370DB', '#FF6347', '#FFA500'];

    return (
        <div className="div-main" >
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mt: 1, mb: 1.5 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'var(--primary-font-color)' }}>
                        Welcome back, {isLoading ? '' : (userName || 'Guest')}!
                    </Typography>
                    <Typography sx={{ color: 'var(--secondary-font-color)' }}>
                        How's it going?
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WorkspacePremiumIcon sx={{ color: 'var(--third-color)' }} />
                    <Typography sx={{ fontWeight: 'bold', fontSize: '25px', color: 'var(--primary-font-color)' }}>
                        Hemat
                    </Typography>
                </Box>
            </Box>

            {/* garis */}
            <Box
                sx={{
                    height: "1px",
                    width: "100%",
                    backgroundColor: "var(--secondary-font-color)",
                    marginBottom: "2rem"
                }}
            />

            <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>

                <Grid item xs={12} sm={6} md={3}>
                    <SummaryCard
                        title="Balance" value={formatToRupiah(balance)}
                        isLoading={isLoading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <SummaryCard
                        title="Income" value={formatToRupiah(totalIncome)}
                        isLoading={isLoading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <SummaryCard
                        title="Expenses" value={formatToRupiah(totalExpenses)}
                        isLoading={isLoading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <SummaryCard
                        title="Scholarship"
                        value={formatToRupiah(scholarship)}
                        isLoading={isLoading}
                    />
                </Grid>

                {/* kotak 5 (grafik) */}
                <Grid item xs={12}>
                    <Paper
                        elevation={4}
                        sx={{
                            p: { xs: 1.5, sm: 2, md: 3 },
                            backgroundColor: 'var(--secondary-color)',
                            color: 'var(--primary-font-color)',
                            borderRadius: '10px',
                            height: { xs: 200, sm: 300 },
                            width: { xs: 300, sm: 560 },
                            minWidth: 'auto',
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                            Monthly Overview
                        </Typography>

                        {/* kontainer untuk grafik (isi) */}
                        <Box sx={{ width: '100%', height: 'calc(100% - 100px)' }}>
                            {isLoading ? (
                                <Box sx={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <ResponsiveContainer width="100%" height="120%">
                                    <LineChart data={lineChartData} margin={{ top: 5, right: 20, left: -5, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                        <XAxis dataKey="week" tick={{ fill: 'var(--secondary-font-color)' }} stroke="var(--secondary-font-color)" />
                                        <YAxis tick={{ fill: 'var(--secondary-font-color)' }} stroke="var(--secondary-font-color)" domain={[0, yAxisMax]} tickFormatter={yAxisFormatter} />
                                        <Tooltip formatter={(value) => formatToRupiah(value)} contentStyle={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--border-color)' }} labelStyle={{ color: 'var(--primary-font-color)' }} />
                                        <Legend wrapperStyle={{ color: 'white' }} />
                                        <Line type="monotone" dataKey="Income" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 6 }} />
                                        <Line type="monotone" dataKey="Expenses" stroke="#FFA500" strokeWidth={2} activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </Box>
                    </Paper>
                </Grid>

                {/* kotak 6 (pieChart) */}
                <Grid item xs={12} md={6}>
                    <Paper
                        elevation={4}
                        sx={{
                            p: { xs: 1.5, sm: 2, md: 3 },
                            backgroundColor: 'var(--secondary-color)',
                            color: 'var(--primary-font-color)',
                            borderRadius: '10px',
                            height: { xs: 200, sm: 300 },
                            width: { xs: 300, sm: 560 },
                            minWidth: 'auto',
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                            Expense Categories
                        </Typography>
                        <Box sx={{ width: '100%', height: 'calc(100% - 40px)' }}>
                            {isLoading ? (
                                <Box sx={{
                                    display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center'
                                }}
                                >
                                    <CircularProgress />
                                </Box>
                            ) : pieChartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieChartData}
                                            cx="50%"
                                            cy="50%" // tataletak
                                            innerRadius={50} // membuat lobang tengah
                                            outerRadius={100} // sesuaikan ukuran tebal
                                            paddingAngle={0} //jarak/batas
                                            dataKey="value"
                                            nameKey="displayName"
                                        >
                                            {pieChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            content={<CustomTooltip />} // hofernya
                                        />
                                        <Legend verticalAlign="middle" align="right" layout="vertical" iconSize={10} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                    <Typography sx={{ color: 'var(--secondary-font-color)' }}>There is no expenditure data yet.</Typography>
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}

export default Dashboard;