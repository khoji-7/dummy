// PostsComp.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PostsComp() {
    const [posts, setPosts] = useState([]);
    const [tags, setTags] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("title");
    const [order, setOrder] = useState("asc");
    const [selectedTag, setSelectedTag] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = () => {
            let url = 'https://dummyjson.com/posts';
            const params = new URLSearchParams();

            if (searchQuery) {
                params.append('search', searchQuery);
            }

            if (selectedTag) {
                url = `https://dummyjson.com/posts/tag/${selectedTag}`;
            }

            if (sortBy) {
                params.append('sortBy', sortBy);
                params.append('order', order);
            }

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            fetch(url)
                .then(res => res.json())
                .then(data => setPosts(data.posts || []))
                .catch(error => console.error("Error fetching posts:", error));
        };

        fetchPosts();
    }, [searchQuery, sortBy, order, selectedTag]);

    useEffect(() => {
        fetch('https://dummyjson.com/posts/tags')
            .then(res => res.json())
            .then(data => setTags(data))
            .catch(error => console.error("Error fetching tags:", error));
    }, []);

    const handlePostClick = (postId) => {
        navigate(`/detail/${postId}/post`);
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
                    <select
                        value={selectedTag}
                        onChange={(e) => setSelectedTag(e.target.value)}
                        className='border border-gray-300 rounded-lg p-2 mt-2'
                    >
                        <option value="">All Tags</option>
                        {tags.map(tag => (
                            <option key={tag.slug} value={tag.slug}>
                                {tag.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className='border border-gray-300 rounded-lg p-2 mt-2'
                    >
                        <option value="title">Sort by Title</option>
                        <option value="date">Sort by Date</option>
                    </select>
                    <select
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                        className='border border-gray-300 rounded-lg p-2 mt-2'
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
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
