import { Outlet, Navigate } from "react-router-dom"; 

const ProtectedRoutes = () => {
    const isLoggedIn = localStorage.getItem("email");
    return isLoggedIn ? <Outlet /> : <Navigate to="/" />;
}

export default ProtectedRoutes