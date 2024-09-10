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
            <button onClick={logout} className='logoutBtn'>
                Log out
            </button>
        </div>
    );
}

export default ProductsPage;
