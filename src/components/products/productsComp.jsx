import React, { useEffect, useState } from 'react';
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
    const [newProduct, setNewProduct] = useState({ title: '', price: '', description: '', category: '', brand: '' });
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchProducts = () => {
            const limit = 10;
            const skip = (page - 1) * limit;
            let url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}&select=title,price,description,images`;

            if (searchQuery) {
                url = `https://dummyjson.com/products/search?q=${searchQuery}&limit=${limit}&skip=${skip}`;
            } else if (selectedCategory) {
                url = `https://dummyjson.com/products/category/${selectedCategory}?limit=${limit}&skip=${skip}`;
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
                    setTotalPages(Math.ceil(data.total / 10));
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
        setSelectedImage(product.images[0]);
        setIsProductModalOpen(true);
    };

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    const handleAddProduct = () => {
        if (!newProduct.title || !newProduct.price || !newProduct.description || !newProduct.category || !newProduct.brand) {
            toast.error('All fields are required.');
            return;
        }

        fetch('https://dummyjson.com/products/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct)
        })
        .then(res => res.json())
        .then(data => {
            setProducts(prevProducts => [data, ...prevProducts]);
            setNewProduct({ title: '', price: '', description: '', category: '', brand: '' });
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
        <section className='max-w-7xl mx-auto p-6'>
            <div className="flex justify-between items-center mb-6 bg-white shadow-md rounded-lg p-4">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className='bg-blue-600 text-white rounded-lg px-6 py-2 font-semibold hover:bg-blue-700 transition'
                >
                    Add Product
                </button>
                <input 
                    type="text" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    placeholder="Search products..." 
                    className='border border-gray-300 rounded-lg px-4 py-2 w-2/5'
                />
                <div className="flex space-x-4">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className='border border-gray-300 rounded-lg p-2'
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

            {/* Product Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                {products.map(product => (
                    <div
                        key={product.id}
                        className='bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105'
                        onClick={() => handleProductClick(product)}
                    >
                        <img 
                            src={product.images[0]} // Assumes images is an array
                            alt={product.title} 
                            className='w-auto items-center h-48 object-cover'
                        />
                        <div className='p-4'>
                            <h2 className='text-lg font-semibold mb-2'>{product.title}</h2>
                            <p className='text-gray-600 mb-2'>${product.price}</p>
                            <p className='text-gray-500'>{product.description}</p>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevents triggering product click event
                                    handleDeleteProduct(product.id);
                                }}
                                className='bg-red-600 text-white rounded-lg px-4 py-2 mt-2 w-full'
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-6">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Previous
                </button>
                <span className="text-lg">Page {page} of {totalPages}</span>
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Next
                </button>
            </div>

            {/* Modals */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <form className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-semibold mb-4">Add New Product</h2>
                        <input
                            type="text"
                            placeholder="Title"
                            value={newProduct.title}
                            onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                            className="border border-gray-300 rounded-lg p-2 w-full mb-2"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                            className="border border-gray-300 rounded-lg p-2 w-full mb-2"
                            required
                        />
                        <textarea
                            placeholder="Description"
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            className="border border-gray-300 rounded-lg p-2 w-full mb-2"
                            required
                        />
                        <select
                            value={newProduct.category}
                            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                            className="border border-gray-300 rounded-lg p-2 w-full mb-2"
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        <div className="flex justify-end space-x-2 mt-4">
                            <button 
                                type="button" // Prevent form submission
                                onClick={() => setIsModalOpen(false)} 
                                className="bg-gray-500 text-white py-2 px-4 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button 
                                type="button" // Prevent form submission
                                onClick={handleAddProduct} 
                                className="bg-blue-600 text-white py-2 px-4 rounded-lg"
                            >
                                Add Product
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {isProductModalOpen && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 mx-auto">
                        <h2 className="text-2xl font-semibold mb-4 text-blue-600">{selectedProduct.title}</h2>
                        <div className='flex'>
                            <img
                                src={selectedImage}
                                alt={selectedProduct.title}
                                className="w-full h-96 object-contain mb-4 rounded-lg"
                            />
                            <div className="flex flex-col gap-2 w-44 ml-4">
                                {selectedProduct.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Thumbnail ${index}`}
                                        className="w-20 h-20 object-cover cursor-pointer rounded-md border border-gray-300"
                                        onClick={() => handleImageClick(image)}
                                    />
                                ))}
                            </div>
                        </div>
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
        </section>
    );
}

export default ProductComp;
