import { useState } from "react";
import "./RegisForm.css";
import { useNavigate } from "react-router-dom";

import { doc, collection, addDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

const RegisForm = () => {
    const [error, setError] = useState(false);
    const [data, setData] = useState({});

    const backToLogin = useNavigate()

    const handelInput = (e) => {
        const id = e.target.id;
        const value = e.target.value;
        setData({ ...data, [id]: value });
    };

    // console.log(data)

    const prosesRegis = async (e) => {
        e.preventDefault();

        if (data.password.length < 6) {
            setError(true);
            return;
        }

        try {
            const res = await createUserWithEmailAndPassword(auth, data.email, data.password);
            await setDoc(doc(db, "users", res.user.uid), {
                ...data
            });
            setData({
                username: "",
                email: "",
                password: ""
            });
            backToLogin("/login")

        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    return (
        <div class="regis-container">

            <div class="finbuddy">
                <img src="image.png" alt="FinBuddy" />
                <p class="finbuddy-title">FinBuddy</p>
            </div>

            <div class="regis-form-container">
                <div class="back-login">
                    <a href="/login" to="/login">
                        <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor"
                            class="bi bi-arrow-left" viewBox="0 0 16 16" color="#ffffff" display={"flex"} margin-left={"10px"}>
                            <path fill-rule="evenodd"
                                d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                        </svg>
                    </a>
                </div>
                <form onSubmit={prosesRegis} class="form-regis" action="">
                    <div class="form-input">
                        <label class="title" For="Username">Username</label>
                        <input
                            type="Username"
                            placeholder="Enter your name"
                            title="Username"
                            id="username"
                            onChange={handelInput}
                            value={data.username}
                            required
                        />
                    </div>
                    <div class="form-input">
                        <label class="title" For="Email">Email</label>
                        <input
                            type="Email"
                            placeholder="Enter your email"
                            title="Email"
                            id="email"
                            onChange={handelInput}
                            value={data.email}
                            required
                        />
                    </div>
                    <div class="form-input">
                        <label class="title" For="Password">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••••••••••"
                            title="Password"
                            id="password"
                            onChange={handelInput}
                            value={data.password}
                            required
                        />
                        {error && <span class="error">password must be at least 6 characters</span>}
                    </div>


                    <button type="submit" class="regis-button">Regis now</button>

                </form>
            </div>
        </div>
    );
};

export default RegisForm;