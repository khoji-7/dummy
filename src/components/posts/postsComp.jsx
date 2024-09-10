import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PostsComp() {
    const [posts, setPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = () => {
            const url = searchQuery 
                ? `https://dummyjson.com/posts/search?q=${searchQuery}`
                : 'https://dummyjson.com/posts';

            fetch(url)
                .then(res => res.json())
                .then(data => {
                    setPosts(data.posts);
                })
                .catch(error => console.error("Error fetching data:", error));
        };

        fetchPosts();
    }, [searchQuery]); // searchQuery o'zgarganda faqat fetch qilish

    const handlePostClick = (postId) => {
        navigate(`/post/${postId}`);
    };

    return (
        <section className='max-w-full m-auto'>
            <main className='max-w-7xl m-auto flex flex-col'>
                <div className='p-4'>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search posts..."
                        className='border border-gray-300 rounded-lg p-2 w-full'
                    />
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                    {posts.map(post => (
                        <div 
                            key={post.id} 
                            className='post-card border border-gray-200 rounded-lg shadow-lg p-4' 
                            onClick={() => handlePostClick(post.id)}
                        >
                            <h2 className='text-lg font-semibold mb-2'>{post.title}</h2>
                            <p className='text-gray-600 mb-2'>{post.body}</p>
                        </div>
                    ))}
                </div>
            </main>
        </section>
    );
}

export default PostsComp;
