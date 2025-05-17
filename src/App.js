import LoginForm from './component/LoginForm/LoginForm';
import RegisForm from './component/RegisForm/RegisForm';
import Home from './component/Home/Home';

import ProtectedRoutes from './component/utils/ProtectedRoutes';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {

    return (
        <Router>
            <div>
                <Routes>
                    {/* <Route path="/About" element={<LoginForm />} /> */}
                    <Route path="/" element={<LoginForm />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisForm />} />
                    {/* <Route element={<ProtectedRoutes />}> */}

                        <Route path="/home" element={<Home />} />

                    {/* </Route> */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
