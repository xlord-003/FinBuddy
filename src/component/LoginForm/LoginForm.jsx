import { useEffect, useState } from "react";
import "./LoginForm.css";
import { Link } from "react-router-dom";
import logo from '../../image/logo.png';

import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
    const [error, setError] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [value, setValue] = useState("");

    const home = useNavigate() //home/main

    const prosesLogin = (e) => {
        e.preventDefault();

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // signed in user
                const user = userCredential.user;
                console.log(user);
                localStorage.setItem("email", user.email);
                home("/dashboard") //jika benar > home/main
            })
            .catch((error) => {
                setError(true);
                const errorCode = error.code;
                const errorMessage = error.message;
            });

    };

    //login with google
    const googleSignIn = () => {
        signInWithPopup(auth, provider).then((data) => {
            setValue(data.user.email)
            localStorage.setItem('email', data.user.email)
            home("/dashboard")
        })

    };

    useEffect(() => {
        setValue(localStorage.getItem('email'))
    })

    return (

        <div class="login-container">

            <div class="login-finbuddy">
                <img src={logo} alt="FinBuddy" />
                <p class="login-title">
                    Explore FinBuddy
                </p>
                <p>Your Personal Coach for Smarter Saving</p>
            </div>

            <div class="form-container">
                <p class="title">Welcome Back!</p>
                <form onSubmit={prosesLogin} class="form-login">
                    <div class="form-title">
                        <p class="sub-title">
                            Don’t have an account? 
                            <Link to="/register"> Create new account</Link>
                        </p>
                    </div>
                    <div class="form-input">
                        <label class="title" For="Email">Email</label>
                        <input
                            type="Email"
                            placeholder="Enter your email"
                            title="Email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div class="form-input">
                        <label class="title" For="Password">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••••••••••"
                            title="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div class="froget-password">
                        <a href="#">Forgot password?</a>
                    </div>
                    <div class="form-button">
                        <button type="submit" class="login-button"  corsor= "pointer" >Login now</button>
                        {error && <span class="error">wrong email or password</span>}
                        <label class="or">or</label>
                        <button type="button" class="google-button" onClick={googleSignIn} >
                            <img class="google-icon" src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google" />
                            <label For="Button-google">Login with Google</label>
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default LoginForm;
