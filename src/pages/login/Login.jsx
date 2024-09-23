import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import "react-toastify/dist/ReactToastify.css";

function LoginPage() {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const login = (event) => {
        event.preventDefault();

        fetch("https://dummyjson.com/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: user,
                password: password,
                expiresInMins: 30,
            }),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Login failed. Please check your credentials.");
            }
            return response.json();
        })
        .then((elem) => {
            if (elem?.token) {
                toast.success("Login successful!");
                localStorage.setItem("accessToken", elem.token); // accessToken saqlash
                if (elem.refreshToken) {
                    localStorage.setItem("refreshToken", elem.refreshToken);
                }
                navigate("/");
            } else {
                toast.error("Login failed. Check your credentials.");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            toast.error("Something went wrong.");
        });
    };

    return (
        <section className="w-full h-screen justify-center items-center flex bg-slate-200">
            <form
                onSubmit={login}
                className="max-w-80 w-full rounded-lg p-5 m-auto border-solid border-2 gap-5 flex flex-col border-cyan-900 bg-stone-50"
            >
                <input
                    type="text"
                    onChange={(e) => setUser(e.target.value)}
                    required
                    minLength={3}
                    className="max-w-xs border-solid border-2 rounded-xl border-cyan-900 px-3 py-1 sm:max-w-full sm:w-full"
                    placeholder="Username emilys"
                />
                <div className="relative w-full sm:max-w-full">
                    <input
                        type={showPassword ? "text" : "password"}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={3}
                        className="max-w-xs border-solid border-2 rounded-xl border-cyan-900 px-3 py-1 sm:max-w-full sm:w-full"
                        placeholder="Password emilyspass"
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 px-3 flex items-center"
                    >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}{" "}
                    </button>
                </div>
                <button
                    type="submit"
                    className="loginBtn rounded-md border-none py-1.5 bg-blue-500 text-white sm:py-2 sm:text-sm sm:w-full"
                >
                    Login
                </button>
            </form>
            <ToastContainer />
        </section>
    );
}

export default LoginPage;
