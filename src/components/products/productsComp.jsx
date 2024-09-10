import React, { useEffect, useState } from 'react';

function ProductTable() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('https://dummyjson.com/products')
            .then(res => res.json())
            .then(data => {
                setProducts(data.products);
            })
            .catch(error => console.error("Error fetching data:", error));
    }, []);
    console.log(products)

    return (
        <section className='max-w-full m-auto'>
            <main className='max-w-7xl m-auto flex flex-col'>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                    {products.map(product => (
                        <div key={product.id} className='product-card border border-gray-200 rounded-lg shadow-lg p-4'>
                            <img 
                                src={product.images} 
                                alt={product.title} 
                                className='w-full h-48 object-cover rounded-lg mb-4 '
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

export default ProductTable;
