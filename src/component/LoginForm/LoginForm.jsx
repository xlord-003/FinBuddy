import { useEffect, useState } from "react";
import "./LoginForm.css";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebaseConfig";
import { toast } from "react-toastify";
import logo from "../../image/logo.png";

const LoginForm = () => {
    const [error, setError] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [value, setValue] = useState("");
    const navigate = useNavigate();

    const prosesLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            localStorage.setItem("email", user.email);
            toast.success("Logged in successfully!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
            navigate("/dashboard");
        } catch (error) {
            setError(true);
        }
    };

    const googleSignIn = async () => {
        try {
            const data = await signInWithPopup(auth, provider);
            setValue(data.user.email);
            localStorage.setItem("email", data.user.email);
            toast.success("Logged in with Google successfully!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
            navigate("/dashboard");
        } catch (error) {
            toast.error("Failed to log in with Google: " + error.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
        }
    };

    useEffect(() => {
        setValue(localStorage.getItem("email"));
    }, []);

    return (
        <div className="login-container">
            <div className="login-finbuddy">
                <img src={logo} alt="FinBuddy" />
                <p className="login-title">Explore FinBuddy</p>
                <p>Your Personal Coach for Smarter Saving</p>
            </div>

            <div className="form-container">
                <p className="title">Welcome Back!</p>
                <form onSubmit={prosesLogin} className="form-login">
                    <div className="form-title">
                        <p className="sub-title">
                            Don’t have an account? <Link to="/register">Create new account</Link>
                        </p>
                    </div>
                    <div className="form-input">
                        <label className="title" htmlFor="Email">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            title="Email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-input">
                        <label className="title" htmlFor="Password">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••••••••••"
                            title="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="froget-password">
                        <a>
                            <Link to="/forgot-password">Forgot password?</Link>
                        </a>
                    </div>
                    <div className="form-button">
                        <button type="submit" className="login-button" style={{ cursor: "pointer" }}>
                            Login now
                        </button>
                        {error && <span className="error">Wrong email or password</span>}
                        <label className="or">or</label>
                        <button type="button" className="google-button" onClick={googleSignIn}>
                            <img
                                className="google-icon"
                                src="https://img.icons8.com/color/48/000000/google-logo.png"
                                alt="Google"
                            />
                            <label htmlFor="Button-google">Login with Google</label>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;