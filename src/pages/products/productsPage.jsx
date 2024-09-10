import React from 'react';
import ProductsComp from '../../components/products/productsComp';
import { useNavigate } from 'react-router';

const ProductsPage = () => {
    let navigate = useNavigate();
    
    const logout = () => {
        localStorage.removeItem("tokenbek");
        navigate("/login");
    };

    return (
        <div>
            <ProductsComp />
            <button 
            onClick={logout} 
            className="w-36 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#5B99C2] transition duration-300"
          >
            Log out
          </button>
        </div>
    );
}

export default ProductsPage;
