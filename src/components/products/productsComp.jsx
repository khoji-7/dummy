import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function ProductComp() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('title');
    const [order, setOrder] = useState('asc');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({ title: '', price: '', description: '', category: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = () => {
            let url = 'https://dummyjson.com/products';
            const params = new URLSearchParams();

            if (searchQuery) {
                url = `https://dummyjson.com/products/search?q=${searchQuery}`;
            } else if (selectedCategory) {
                url = `https://dummyjson.com/products/category/${selectedCategory}`;
            } else {
                if (sortBy) {
                    params.append('sortBy', sortBy);
                }
                if (order) {
                    params.append('order', order);
                }
                if (params.toString()) {
                    url += (url.includes('?') ? '&' : '?') + params.toString();
                }
            }

            fetch(url)
                .then(res => res.json())
                .then(data => setProducts(data.products || []))
                .catch(error => console.error("Error fetching data:", error));
        };

        fetchProducts();
    }, [searchQuery, sortBy, order, selectedCategory]);

    useEffect(() => {
        fetch('https://dummyjson.com/products/category-list')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(error => console.error("Error fetching categories:", error));
    }, []);

    const handleProductClick = (productId) => {
        navigate(`/detail/${productId}/product`);
    };

    const handleAddProduct = () => {
        fetch('https://dummyjson.com/products/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct)
        })
        .then(res => res.json())
        .then(data => {
            setProducts(prevProducts => [data, ...prevProducts]);
            setNewProduct({ title: '', price: '', description: '', category: '' });
            setIsModalOpen(false);
            toast.success('Product added successfully!');
        })
        .catch(error => {
            console.error("Error adding product:", error);
            toast.error('Failed to add product.');
        });
    };

    const handleDeleteProduct = (productId) => {
        fetch(`https://dummyjson.com/products/${productId}`, {
            method: 'DELETE',
        })
        .then(res => res.json())
        .then(data => {
            if (data.isDeleted) {
                setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
                toast.success('Product deleted successfully!');
            }
        })
        .catch(error => {
            console.error("Error deleting product:", error);
            toast.error('Failed to delete product.');
        });
    };

    return (
        <section className='max-w-full m-auto'>
            <main className='max-w-7xl m-auto flex flex-col'>
                {/* Search input */}
                <div className="p-4 flex flex-row justify-between sticky top-0 bg-stone-50">
                <button
                        onClick={() => setIsModalOpen(true)}
                        className='bg-blue-500 text-white rounded-lg px-4 py-1 w-1/6'
                    >
                        Add Product
                    </button>  
                    <input 
                        type="text" 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        placeholder="Search products..." 
                        className='border border-gray-300 rounded-lg px-4 py-1 w-2/6'
                    />
                    <div className="w-2/6 flex flex-row justify-between">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className='border border-gray-300 rounded-lg p-2 mr-2 '
                    >   <option value="">Sort by</option>
                        <option value="title">Title</option>
                        <option value="price">Price</option>
                        <option value="rating">Rating</option>
                    </select>

                    <select
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                        className='border border-gray-300 rounded-lg p-2'
                    >   <option value="">Order</option>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className='border border-gray-300 rounded-lg p-2'
                    >
                        <option value="">Category</option>
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
                </div>

                

              
              

           
                

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h2 className="text-lg font-semibold mb-4">Add New Product</h2>
                            <input
                                type="text"
                                placeholder="Title"
                                value={newProduct.title}
                                onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                                className="border border-gray-300 rounded-lg p-2 w-full mb-2"
                            />
                            <input
                                type="number"
                                placeholder="Price"
                                value={newProduct.price}
                                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                className="border border-gray-300 rounded-lg p-2 w-full mb-2"
                            />
                            <textarea
                                placeholder="Description"
                                value={newProduct.description}
                                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                className="border border-gray-300 rounded-lg p-2 w-full mb-2"
                            />
                            <select
                                value={newProduct.category}
                                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                className="border border-gray-300 rounded-lg p-2 w-full mb-2"
                            >
                                <option value="">Select Category</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            <div className="flex justify-end space-x-2">
                                <button 
                                    onClick={() => setIsModalOpen(false)} 
                                    className="bg-gray-500 text-white py-2 px-4 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleAddProduct} 
                                    className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                                >
                                    Add Product
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Product Grid */}
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
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevents triggering product click event
                                    handleDeleteProduct(product.id);
                                }}
                                className='bg-red-500 text-white rounded-lg px-4 py-2 mt-2'
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </main>
        </section>
    );
}

export default ProductComp;
