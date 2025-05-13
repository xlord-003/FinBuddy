import { useState } from "react";
import "./LoginForm.css";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
    const [error, setError] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const home = useNavigate() //home/main

    const prosesLogin = (e) => {
        e.preventDefault();

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log(user);
                home("/home") //jika benar > home/main
            })
            .catch((error) => {
                setError(true);
                const errorCode = error.code;
                const errorMessage = error.message;
            });

    };

    return (

        <div class="login-container">

            <div class="login-finbuddy">
                <img src="image.png" alt="FinBuddy" />
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
                            Don’t have an account? <a href="/register">Create new account</a>
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
                        <button type="submit" class="login-button">Login now</button>
                        <label class="or">or</label>
                        <button class="google-button">
                            <img class="google-icon" src="https://img.icons8.com/color/48/000000/google-logo.png" alt="" />
                            <label For="Button-google">Login with Google</label>
                        </button>
                    </div>
                    {error && <span class="error">wrong email or password</span>}
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
