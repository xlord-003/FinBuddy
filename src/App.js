// import Home from './component/Home/Home';
import LoginForm from './component/LoginForm/LoginForm';
import RegisForm from './component/RegisForm/RegisForm';
import Sidebar from './component/Frame/Sidebar';
import Feed from './component/Frame/Feed';

//MATERIAL
import { Box, Container, Grid, Stack } from '@mui/material';

import ProtectedRoutes from './component/utils/ProtectedRoutes';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './component/Frame/Navbar';

function App() {
    return (
        <Router>
            <Routes>
                {/* <Route path="/" element={<LoginForm />} /> */}
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisForm />} />
                {/* <Route element={<ProtectedRoutes />}>
                </Route> */}
            </Routes>
            <Box>
                <Navbar />
                <Stack direction="row" spacing={2} justifyContent="space-between" color="white">
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <Sidebar />
                        </Grid>
                        <Grid item xs={9}>
                            <Feed />
                        </Grid>
                    </Grid>
                </Stack>
            </Box>
        </Router>
    );
}

export default App;
