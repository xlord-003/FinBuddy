import { useState } from "react";
import "./RegisForm.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import logo from "../../image/logo.png";
import { toast } from "react-toastify";

import { doc, setDoc } from "firebase/firestore";
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
    
    const prosesRegis = async (e) => {
    e.preventDefault();

    // Validasi panjang password
    if (data.password.length < 6) {
        setError(true);
        return;
    }
    setError(false); // Reset error jika validasi berhasil

    try {
        // buat user baru dengan email dan password
        const res = await createUserWithEmailAndPassword(auth, data.email, data.password);

        const dataToStore = {
            username: data.username,
            email: data.email
            // Password TIDAK disertakan
        };

        // 3. Simpan hanya data profil ke Firestore
        await setDoc(doc(db, "users", res.user.uid), dataToStore);

        // Reset form setelah berhasil
        setData({
            username: "",
            email: "",
            password: ""
        });
        
        // Arahkan ke halaman login
        backToLogin("/login");

    } catch (err) { 
        // Tampilkan pesan error yang lebih baik kepada pengguna
        if (err.code === 'auth/email-already-in-use') {
            // alert('Email ini sudah terdaftar. Silakan gunakan email lain.');
            toast.error('Email ini sudah terdaftar. Silakan gunakan email lain.');
        } else {
            // alert('Gagal melakukan registrasi. Silakan coba lagi.');
            toast.error('Gagal melakukan registrasi. Silakan coba lagi.');
        }
        console.error("Error saat registrasi: ", err);
    }
};

    return (
        <div class="regis-container">

            <div class="finbuddy">
                <img src={logo} alt="FinBuddy" height="100px" margin-right={"-2rem"}/>
                <p class="finbuddy-title">FinBuddy</p>
            </div>

            <div class="regis-form-container">
                <div class="back-login">
                    <Link to="/login">
                        <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor"
                            class="bi bi-arrow-left" viewBox="0 0 16 16" color="#ffffff" style={{ display: "flex", marginLeft: "3px" }}>
                            <path fill-rule="evenodd"
                                d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                        </svg>
                    </Link>
                </div>
                <form onSubmit={prosesRegis} class="form-regis" action="">
                    <div class="form-input">
                        <label class="title" For="Username">Username</label>
                        <input
                            type="Username"
                            placeholder="Enter your name"
                            name="username"
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