import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Homepage from "./pages/Homepage/homepage";
import LoginForm from "./component/LoginForm/LoginForm";
import RegisForm from "./component/RegisForm/RegisForm";
import ForgotPassword from "./component/ForgotPassword/ForgotPassword";
import Income from "./pages/Income/Income";
import Expences from "./pages/Expenses/Expenses";
import Dashboard from "./pages/Dashboard/Dashboard";
import History from "./pages/History/History";
import SaveTips from "./pages/SaveTips/SaveTips";
import AddIncome from "./pages/Income/AddIncome";
import AddExpenses from "./pages/Expenses/AddExpenses";
import EditIncome from "./pages/Income/EditIncome"; // Pastikan komponen ini diimpor
import EditExpenses from "./pages/Expenses/EditExpenses";
import Sidebar from "./component/Frame/Sidebar";
import Navbar from "./component/Frame/Navbar";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";

// import { Box, useTheme, useMediaQuery } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';

function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Check authentication state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Auto-close sidebar on mobile and keep it closed by default on mobile
    useEffect(() => {
        if (isMobile) {
            setSidebarOpen(false);
        } else {
            setSidebarOpen(true);
        }
    }, [isMobile]);

    const handleMenuClick = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };

    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <Router>
            {/* Toast untuk notifikasi */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                theme="colored"
            />

            {/* Definisi rute */}
            <Routes>
                {/* Rute publik: Login dan Register */}
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisForm />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Rute yang dilindungi oleh ProtectedRoutes */}


                {/* Protected Routes - Only show if user is authenticated */}
                {user && (
                    <Route
                        path="/*"
                        element={
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100vh', // Full viewport height
                                    overflow: 'hidden', // Prevent scrolling
                                }}
                            >
                                <Navbar onMenuClick={handleMenuClick} />
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flex: 1,
                                        overflow: 'hidden', // Prevent scrolling
                                    }}
                                >
                                    <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
                                    <Box
                                        component="main"
                                        sx={{
                                            flex: 1,
                                            p: { xs: 2, sm: 3 },
                                            bgcolor: 'var(--background-color)',
                                            // height: '100%', // HAPUS baris ini jika tidak perlu
                                            overflowY: 'auto', // Ganti dari 'hidden' ke 'auto'
                                            width: {
                                                xs: '100%',
                                                md: sidebarOpen ? 'calc(100% - 250px)' : '100%',
                                            },
                                            transition: 'width 0.3s ease-in-out',
                                        }}
                                    >
                                        <Routes>
                                            <Route path="/dashboard" element={<Dashboard />} />
                                            <Route path="/income" element={<Income />} />
                                            <Route path="/income/add" element={<AddIncome />} />
                                            <Route path="/income/edit/:id" element={<EditIncome />} /> {/* Rute EditIncome */}
                                            <Route path="/expenses" element={<Expences />} />
                                            <Route path="/expenses/add" element={<AddExpenses />} />
                                            <Route path="/expenses/edit" element={<EditExpenses />} />
                                            <Route path="/history" element={<History />} />
                                            <Route path="/savetips" element={<SaveTips />} />
                                        </Routes>
                                    </Box>
                                </Box>
                            </Box>
                        }
                    />
                )}




                {/* 
                <Route element={<ProtectedRoutes />}>
                    <Route
                        element={
                            <Box>
                                <Navbar />
                                <Stack direction="row" spacing={2} justifyContent="space-between">
                                    <Grid container spacing={2}>
                                        <Grid item xs={3}>
                                            <Sidebar />
                                        </Grid>
                                        <Grid item xs={9}>
                                            <Outlet />
                                        </Grid>
                                    </Grid>
                                </Stack>
                            </Box>
                        }
                    >

                    </Route>
                </Route> */}



            </Routes>
        </Router>
    );
}

export default App;