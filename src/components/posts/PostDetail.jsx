import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function PostDetailPage() {
    const { postId } = useParams(); // URL parametrlardan postId ni olish
    const [post, setPost] = useState(null);

    useEffect(() => {
        fetch(`https://dummyjson.com/posts/${postId}`)
            .then(res => res.json())
            .then(data => {
                setPost(data);
            })
            .catch(error => console.error("Error fetching post details:", error));
    }, [postId]);

    if (!post) return <p>Loading...</p>;

    return (
        <section className='max-w-full m-auto'>
            <main className='max-w-7xl m-auto p-4'>
                <div className='bg-white border border-gray-200 rounded-lg shadow-lg p-6'>
                    <h1 className='text-2xl font-bold mb-4'>{post.title}</h1>
                    <p className='text-gray-700 mb-4'>{post.body}</p>
                </div>
            </main>
        </section>
    );
}

export default PostDetailPage;
