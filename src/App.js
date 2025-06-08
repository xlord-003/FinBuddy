import React, { useState, useEffect } from 'react';
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
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, useTheme, useMediaQuery } from '@mui/material';
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
      setSidebarOpen(true);
    } else {
      setSidebarOpen(false);
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
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisForm />} />

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
                      height: '100%', // Fill available height
                      overflow: 'hidden', // Disable scrolling
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
                      <Route path="/expenses" element={<Expences />} />
                      <Route path="/history" element={<History />} />
                      <Route path="/savetips" element={<SaveTips />} />
                      <Route path="/expenses/add" element={<AddExpences />} />
                      <Route path="/income/add" element={<AddIncome />} />
                    </Routes>
                  </Box>
                </Box>
              </Box>
            }
          />
        )}
      </Routes>
    </Router>
  );
}

export default App;