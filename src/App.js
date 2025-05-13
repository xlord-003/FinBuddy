
import React, { Children } from 'react';

import LoginForm from './component/LoginForm/LoginForm';
import RegisForm from './component/RegisForm/RegisForm';
import Home from './component/Home/Home';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {

    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<LoginForm />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisForm />} />
                    <Route path="/home" element={<Home />} />
                    {/* <Route path="/home" element={<Home />} /> */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
