import { useState } from "react";
import "../RegisForm/RegisForm.css";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../image/logo.png";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebaseConfig";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        if (!email) {
            setError("Please enter your email address.");
            return;
        }
        if (!email.endsWith("@gmail.com")) {
            setError("Only Gmail addresses are allowed.");
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage("Password reset email sent! Please check your inbox.");
        } catch (err) {
            if (err.code === 'auth/user-not-found') {
                setError("No user found with this email address.");
            } else {
                setError("Failed to send reset email. Please try again.");
            }
            console.error("Password reset error:", err);
        }
    };
    return (
        <>


            <div className="regis-container">
                <div className="finbuddy">
                    <img src={logo} alt="FinBuddy" height="100px" style={{ marginRight: "-2rem" }} />
                    <p className="finbuddy-title">FinBuddy</p>
                </div>
                <div className="regis-form-container">
                    <div className="back-login">
                        <Link to="/login">
                            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor"
                                className="bi bi-arrow-left" viewBox="0 0 16 16" color="#ffffff" style={{ display: "flex", marginLeft: "3px" }}>
                                <path fillRule="evenodd"
                                    d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                            </svg>
                        </Link>
                    </div>
                    <form onSubmit={handleSubmit} className="form-regis">
                        <div className="form-input">
                            <label className="title" htmlFor="email">Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                id="email"
                                title="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        {message && <span style={{ color: "lightgreen", marginTop: 8 }}>{message}</span>}
                        {error && <span className="error">{error}</span>}
                        <button type="submit" className="regis-button" style={{ marginTop: "2rem" }}>
                            Send Reset Link
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default ForgotPassword