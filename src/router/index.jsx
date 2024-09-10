import {useEffect} from "react";
import {Route, Routes, useNavigate} from "react-router-dom";
import Home from "../pages/home/home";
import LoginPage from "../pages/login/Login";



const AppRouter = () => {
    const token = localStorage.getItem("tokenbek");
    let navigate = useNavigate();
    useEffect(() => {
        if (token?.includes("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey")) {
            navigate("/home");
        } else {
            navigate("/login");
        }
    }, []);
    return (
        <Routes>
            <Route
                path="/home"
                element={ <Home/>}
            />
            <Route path="/login" element={<LoginPage />} />
           

        </Routes>
    );
};

export default AppRouter;
