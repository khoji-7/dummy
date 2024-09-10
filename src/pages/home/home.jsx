import React from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("tokenbek"); // LocalStorage-dan tokenni o'chirish
    toast.success("Logged out successfully!"); // Xabar ko'rsatish
    navigate("/login"); // Login sahifasiga o'tish
  };

  return (
    <div>
      <div>
        <h1>Khoji_7</h1>
        <button onClick={logout} className='loginBtn'>
          Log out
        </button>
      </div>

      {/* NavLink orqali products sahifasiga yo'naltirish */}
      <NavLink to="/products">
        Go to Products
      </NavLink>
      <NavLink to="/post">
        Go to post
      </NavLink>
    </div>
  );
}

export default Home;
