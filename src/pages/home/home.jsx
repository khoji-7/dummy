import React from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate(); // useNavigate orqali navigate funksiyasini olish

  const logout = () => {
    localStorage.removeItem("tokenbek"); // LocalStorage-dan tokenni o'chirish
    toast.success("Logged out successfully!"); // Xabar ko'rsatish
    navigate("/login"); // Bosh sahifaga o'tish
  };

  return (
    <div>
      <h1>
        khoji_7
      </h1>
      <button onClick={logout} className='loginBtn'>
        Log out
      </button>
    </div>
  );
}

export default Home;
