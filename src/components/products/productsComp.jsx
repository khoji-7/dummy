// ProductTable.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProductComp() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('https://dummyjson.com/products')
            .then(res => res.json())
            .then(data => setProducts(data.products))
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    const handleProductClick = (productId) => {
        navigate(`/detail/${productId}/product`);
    };

    return (
        <section className='max-w-full m-auto'>
            <main className='max-w-7xl m-auto flex flex-col'>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-auto'>
                    {products.map(product => (
                        <div
                            key={product.id}
                            className='product-card border border-gray-200 rounded-lg shadow-lg p-4 cursor-pointer'
                            onClick={() => handleProductClick(product.id)}
                        >
                            <img 
                                src={product.images[0]} // Assumes images is an array
                                alt={product.title} 
                                className='w-auto h-56 object-cover rounded-lg mb-4 mx-auto'
                            />
                            <h2 className='text-lg font-semibold mb-2'>{product.title}</h2>
                            <p className='text-gray-600 mb-2'>${product.price}</p>
                            <p className='text-gray-500'>{product.description}</p>
                        </div>
                    ))}
                </div>
            </main>
        </section>
    );
}

export default ProductComp;
