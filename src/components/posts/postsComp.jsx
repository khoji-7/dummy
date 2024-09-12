import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function PostsComp() {
    const [posts, setPosts] = useState([]);
    const [tags, setTags] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("title");
    const [order, setOrder] = useState("asc");
    const [selectedTag, setSelectedTag] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', body: '', userId: 5 });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);
    const [postsPerPage] = useState(10);
    const [singlePost, setSinglePost] = useState(null);
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

            params.append('limit', postsPerPage);
            params.append('skip', (currentPage - 1) * postsPerPage);
            params.append('select', 'title,body,userId');

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            fetch(url)
                .then(res => res.json())
                .then(data => {
                    setPosts(data.posts || []);
                    setTotalPosts(data.total || 0);
                })
                .catch(error => console.error("Error fetching posts:", error));
        };

        fetchPosts();
    }, [searchQuery, sortBy, order, selectedTag, currentPage]);

    useEffect(() => {
        fetch('https://dummyjson.com/posts/tags')
            .then(res => res.json())
            .then(data => setTags(data))
            .catch(error => console.error("Error fetching tags:", error));
    }, []);

    const handlePostClick = (postId) => {
        navigate(`/detail/${postId}/post`);
    };

    const handleViewPost = (postId) => {
        fetch(`https://dummyjson.com/posts/${postId}`)
            .then(res => res.json())
            .then(data => {
                setSinglePost(data);
                setIsModalOpen(true);
            })
            .catch(error => {
                console.error("Error fetching post:", error);
                toast.error("Failed to fetch post details.");
            });
    };

    const handleAddPost = async () => {
        if (!newPost.title || !newPost.body) {
            toast.error("Please fill in all fields.");
            return;
        }

        try {
            const response = await fetch('https://dummyjson.com/posts/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPost),
            });

            if (!response.ok) {
                throw new Error('Failed to add post.');
            }

            const data = await response.json();
            setPosts(prevPosts => [...prevPosts, data]);
            setIsModalOpen(false);
            setNewPost({ title: '', body: '', userId: 5 });
            toast.success("Post added successfully!");
        } catch (error) {
            console.error("Error adding post:", error);
            toast.error("Failed to add post.");
        }
    };

    const handleDeletePost = (postId) => {
        fetch(`https://dummyjson.com/posts/${postId}`, {
            method: 'DELETE',
        })
            .then(res => res.json())
            .then(data => {
                if (data.isDeleted) {
                    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
                    toast.success(`Post deleted on ${data.deletedOn}`);
                } else {
                    toast.error("Failed to delete post.");
                }
            })
            .catch(error => {
                console.error("Error deleting post:", error);
                toast.error("Something went wrong.");
            });
    };

    const handleClosePostModal = () => {
        setSinglePost(null);
        setIsModalOpen(false);
    };

    const totalPages = Math.ceil(totalPosts / postsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <section className='max-w-full m-auto'>
            <main className='max-w-7xl m-auto flex flex-col'>
                <div className='p-4 flex flex-row justify-between sticky top-2 bg-stone-50'>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className='bg-blue-500 text-white py-2 px-4 w-1/5 rounded-lg'
                    >
                        Add New Post
                    </button>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search posts..."
                        className='border border-gray-300 rounded-lg p-2 w-2/6'
                    />
                    <div className='flex flex-row w-2/6 gap-5'>
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
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                    {posts.map(post => (
                        <div
                            key={post.id}
                            className='post-card border border-gray-200 rounded-lg shadow-lg p-4 cursor-pointer'
                            onClick={() => handleViewPost(post.id)}
                        >
                            <h2 className='text-lg font-semibold mb-2'>{post.title}</h2>
                            <p className='text-gray-600 mb-2'>{post.body}</p>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeletePost(post.id);
                                }}
                                className="text-white ml-4 bg-red-500 border-none rounded-xl p-1.5"
                            >
                                Delete Post
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between items-center mt-4 w-96">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                        Next
                    </button>
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                            <h2 className="text-xl font-semibold mb-4">Add New Post</h2>
                            <input
                                type="text"
                                value={newPost.title}
                                onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Title"
                                className="border border-gray-300 rounded-lg p-3 mb-4 w-full"
                            />
                            <textarea
                                value={newPost.body}
                                onChange={(e) => setNewPost(prev => ({ ...prev, body: e.target.value }))}
                                placeholder="Body"
                                className="border border-gray-300 rounded-lg p-3 mb-4 w-full"
                            />
                            <div className="flex justify-between items-center mt-4">
                                <button
                                    onClick={handleAddPost}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
                                >
                                    Add Post
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {singlePost && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                            <h2 className="text-xl font-semibold mb-4">Post Details</h2>
                            <h3 className="text-lg font-semibold mb-2">{singlePost.title}</h3>
                            <p className="mb-4">{singlePost.body}</p>
                            <button
                                onClick={handleClosePostModal}
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </section>
    );
}

export default PostsComp;
