import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginForm from "./component/LoginForm/LoginForm";
import RegisForm from "./component/RegisForm/RegisForm";
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
import { Box, Container, Grid, Stack } from "@mui/material";
import ProtectedRoutes from "./component/utils/ProtectedRoutes";
import Homepage from "./pages/Homepage/homepage";


function App() {
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

                {/* Rute yang dilindungi oleh ProtectedRoutes */}
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
                                            <Outlet /> {/* Tempat konten rute anak dirender */}
                                        </Grid>
                                    </Grid>
                                </Stack>
                            </Box>
                        }
                    >
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/income" element={<Income />} />
                        <Route path="/income/add" element={<AddIncome />} />
                        <Route path="/income/edit/:id" element={<EditIncome />} /> {/* Rute EditIncome */}
                        <Route path="/expenses" element={<Expences />} />
                        <Route path="/expenses/add" element={<AddExpenses />} />
                        <Route path="/expenses/edit" element={<EditExpenses />} />
                        <Route path="/history" element={<History />} />
                        <Route path="/savetips" element={<SaveTips />} />
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
}

export default App;