// import Home from './component/Home/Home';
import LoginForm from './component/LoginForm/LoginForm';
import RegisForm from './component/RegisForm/RegisForm';
import Income from './pages/Income/Income';
import Expences from './pages/Expenses/Expenses';
import Dashboard from './pages/Dashboard/Dashboard';
import History from './pages/History/History';
import SaveTips from './pages/SaveTips/SaveTips';
import AddIncome from './pages/Income/AddIncome';
import AddExpences from './pages/Expenses/AddExpences';
import Sidebar from './component/Frame/Sidebar';
import Navbar from './component/Frame/Navbar';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

//MATERIAL
import { Box, Container, Grid, Stack } from '@mui/material';

import ProtectedRoutes from './component/utils/ProtectedRoutes';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisForm />} />
            </Routes>

            {/* <Route element={<ProtectedRoutes />}> */}
                {/* MAIN MENU */}
                <Box>
                    <Navbar />
                    <Stack direction="row" spacing={2} justifyContent="space-between" color="white">
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <Sidebar />
                            </Grid>
                            <Grid item xs={1} >
                                <Routes>
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/income" element={<Income />} />
                                    <Route path="/expenses" element={<Expences />} />
                                    <Route path="/history" element={<History />} />
                                    <Route path="/savetips" element={<SaveTips />} />
                                    <Route path="expenses/add" element={<AddExpences />} />
                                    <Route path="income/add" element={<AddIncome />} />
                                </Routes>
                            </Grid>
                        </Grid>
                    </Stack>
                </Box>
            {/* </Route> */}
        </Router>
    );
}

export default App;
