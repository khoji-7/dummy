import React, { useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Home from "../pages/home/home";
import LoginPage from "../pages/login/Login";
import ProductsPage from "../pages/products/productsPage";
import PostsPage from "../pages/posts/PostsPage";
import UserPage from "../pages/user/UserPage";
import TodosPage from "../pages/todos/TodosPage";

const AppRouter = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        if (token && location.pathname === "/login") {
            navigate("/home"); 
        } else if (!token && location.pathname !== "/login") {
            navigate("/login"); 
        }
    }, [token, location.pathname, navigate]); 

    // useEffect(()=>{
    //     if(token){
    //         navigate("/home");
    //     }else{
    //         navigate("/login");
    //     }
    // }, [])
    return (
        <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/post" element={<PostsPage />} />
            <Route path="/users" element={<UserPage />} />
            <Route path="/todos" element={<TodosPage />} />
        </Routes>
    );
};

export default AppRouter;
