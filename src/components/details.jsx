// DetailPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function DetailPage() {
    const { itemId, itemType } = useParams(); // URL parametrlaridan itemId va itemType ni olish
    const [item, setItem] = useState(null);

    useEffect(() => {
        const fetchItem = async () => {
            let url;
            if (itemType === 'product') {
                url = `https://dummyjson.com/products/${itemId}`;
            } else if (itemType === 'post') {
                url = `https://dummyjson.com/posts/${itemId}`;
            } 
            try {
                const response = await fetch(url);
                const data = await response.json();
                setItem(data);
            } catch (error) {
                console.error("Error fetching item details:", error);
            }
        };

        fetchItem();
    }, [itemId, itemType]);

    if (!item) return <p>Loading...</p>;

    return (
        <section className='max-w-full m-auto'>
            <main className='max-w-7xl m-auto p-4'>
                <div className='bg-white border border-gray-200 rounded-lg shadow-lg p-6'>
                    {itemType === 'product' ? (
                        <>
                            <img 
                                src={item.images[0]} // Assumes images is an array
                                alt={item.title} 
                                className='w-auto h-72 object-fill rounded-lg mb-4 mx-auto'
                            />
                            <h1 className='text-2xl font-bold mb-4'>{item.title}</h1>
                            <p className='text-gray-600 mb-2'>${item.price}</p>
                            <p className='text-gray-500'>{item.description}</p>
                        </>
                    ) : itemType === 'post' ? (
                        <>
                            <h1 className='text-2xl font-bold mb-4'>{item.title}</h1>
                            <p className='text-gray-700 mb-4'>{item.body}</p>
                        </>
                    ) : itemType === 'user' ? (
                        <>
                            <img 
                                src={item.image} // Assumes image is available
                                alt={item.name} 
                                className='w-24 h-24 rounded-full mb-4'
                            />
                            <h1 className='text-2xl font-bold mb-4'>{item.name}</h1>
                            <p className='text-gray-600 mb-2'>{item.email}</p>
                            <p className='text-gray-500'>{item.phone}</p>
                            <p className='text-gray-500'>{item.address}</p>
                        </>
                    ) : null}
                </div>
            </main>
        </section>
    );
}

export default DetailPage;
