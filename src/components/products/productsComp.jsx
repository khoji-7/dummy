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
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({ title: '', price: '', description: '', category: '' });
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = () => {
            const limit = 10;
            const skip = (page - 1) * limit;
            let url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}&select=title,price,description,images`;

            if (searchQuery) {
                url = `https://dummyjson.com/products/search?q=${searchQuery}`;
            } else if (selectedCategory) {
                url = `https://dummyjson.com/products/category/${selectedCategory}`;
            } else {
                const params = new URLSearchParams();
                if (sortBy) params.append('sortBy', sortBy);
                if (order) params.append('order', order);
                if (params.toString()) url += (url.includes('?') ? '&' : '?') + params.toString();
            }

            fetch(url)
                .then(res => res.json())
                .then(data => {
                    setProducts(data.products || []);
                    setTotalPages(Math.ceil(data.total / 10)); // Assuming total products available
                })
                .catch(error => console.error("Error fetching data:", error));
        };

        fetchProducts();
    }, [searchQuery, sortBy, order, selectedCategory, page]);

    useEffect(() => {
        fetch('https://dummyjson.com/products/category-list')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(error => console.error("Error fetching categories:", error));
    }, []);

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setIsProductModalOpen(true);
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

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
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
                            className='border border-gray-300 rounded-lg p-2 mr-2'
                        >
                            <option value="">Sort by</option>
                            <option value="title">Title</option>
                            <option value="price">Price</option>
                            <option value="rating">Rating</option>
                        </select>

                        <select
                            value={order}
                            onChange={(e) => setOrder(e.target.value)}
                            className='border border-gray-300 rounded-lg p-2'
                        >
                            <option value="">Order</option>
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

                {/* Add Product Modal */}
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

                {/* Product Details Modal */}
                {isProductModalOpen && selectedProduct && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h2 className="text-lg font-semibold mb-4">{selectedProduct.title}</h2>
                            <img 
                                src={selectedProduct.images[0]} // Assumes images is an array
                                alt={selectedProduct.title}
                                className="w-full h-48 object-cover mb-4 rounded-lg"
                            />
                            <p className="text-gray-600 mb-2">Price: ${selectedProduct.price}</p>
                            <p className="text-gray-500 mb-4">{selectedProduct.description}</p>
                            <button 
                                onClick={() => setIsProductModalOpen(false)} 
                                className="bg-gray-500 text-white py-2 px-4 rounded-lg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {/* Product Grid */}
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-auto'>
                    {products.map(product => (
                        <div
                            key={product.id}
                            className='product-card border border-gray-200 rounded-lg shadow-lg p-4 cursor-pointer'
                            onClick={() => handleProductClick(product)}
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

                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className='bg-gray-500 text-white rounded-lg px-4 py-2'
                    >
                        Previous
                    </button>
                    <span>Page {page} of {totalPages}</span>
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        className='bg-gray-500 text-white rounded-lg px-4 py-2'
                    >
                        Next
                    </button>
                </div>
            </main>
        </section>
    );
}

export default ProductComp;
