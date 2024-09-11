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
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="flex items-center justify-center h-16 bg-gray-900">
          <h1 className="text-2xl font-bold">Khoji_7</h1>
        </div>
        <nav className="flex-1 px-4 py-6">
          <NavLink 
            to="/products" 
            className="block py-2 px-4 mb-2 rounded-lg hover:bg-gray-700 transition duration-300"
          >
            Go to Products
          </NavLink>
          <NavLink 
            to="/post" 
            className="block py-2 px-4 mb-2 rounded-lg hover:bg-gray-700 transition duration-300"
          >
            Go to Post
          </NavLink>
          <NavLink 
            to="/users" 
            className="block py-2 px-4 mb-2 rounded-lg hover:bg-gray-700 transition duration-300"
          >
            Go to Users
          </NavLink>
          <NavLink 
            to="/todos" 
            className="block py-2 px-4 mb-2 rounded-lg hover:bg-gray-700 transition duration-300"
          >
            Go to todos
          </NavLink>
        </nav>
        <div className="px-4 py-6">
          <button 
            onClick={logout} 
            className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-8">
        {/* Your main content goes here */}
      </main>
    </div>
  );
}

export default Home;
