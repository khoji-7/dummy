import React, {useEffect} from "react";
import {Route, Routes, useNavigate} from "react-router-dom";
import Home from "../pages/home/home";
import LoginPage from "../pages/login/Login";
import ProductsPage from "../pages/products/productsPage";
import PostsPage from "../pages/posts/PostsPage";
import DetailPage from "../components/details.jsx"
import UserPage from "../pages/user/UserPage";


const AppRouter = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        if (token) {
            navigate("/home");
        } else {
            navigate("/login");
        }
    }, []);

    return (
        <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/post" element={<PostsPage />} />
            <Route path="/users" element={<UserPage />} />
            <Route path="/detail/:itemId/:itemType" element={<DetailPage />} />
        </Routes>
    );
};

export default AppRouter;
