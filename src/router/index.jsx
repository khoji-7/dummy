import React, {useEffect} from "react";
import {Route, Routes, useNavigate} from "react-router-dom";
import Home from "../pages/home/home";
import LoginPage from "../pages/login/Login";
import ProductsPage from "../pages/products/productsPage";
import PostsPage from "../pages/posts/PostsPage";
import PostDetailPage from "../components/posts/PostDetail";

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
            <Route path="/post/:postId" element={<PostDetailPage/>} />
        </Routes>
    );
};

export default AppRouter;
