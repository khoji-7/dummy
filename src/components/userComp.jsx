// UserPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserComp() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('https://dummyjson.com/users')
            .then(res => res.json())
            .then(data => setUsers(data.users))
            .catch(error => console.error("Error fetching data:", error));
    }, []);
    console.log(users)

    const handleUserClick = (userId) => {
        navigate(`/detail/${userId}/user`);
    };

    return (
        <section className='max-w-full m-auto'>
            <main className='max-w-7xl m-auto p-4'>
                <div className='overflow-x-auto'>
                    <table className='min-w-full bg-white border border-gray-200'>
                        <thead>
                            <tr>
                                <th className='py-3 px-6 border-b border-gray-200'>Image</th>
                                <th className='py-3 px-6 border-b border-gray-200'>Name</th>
                                <th className='py-3 px-6 border-b border-gray-200'>Email</th>
                                <th className='py-3 px-6 border-b border-gray-200'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr 
                                    key={user.id} 
                                    className='cursor-pointer hover:bg-gray-100' 
                                    onClick={() => handleUserClick(user.id)}
                                >
                                    <td className='py-4 px-6 border-b border-gray-200'>
                                        <img 
                                            src={user.image} // Assumes image is available
                                            alt={user.firstName}
                                            className='w-12 h-12 object-cover rounded-full'
                                        />
                                    </td>
                                    <td className='py-4 px-6 border-b border-gray-200'>{user.firstName}</td>
                                    <td className='py-4 px-6 border-b border-gray-200'>{user.email}</td>
                                    <td className='py-4 px-6 border-b border-gray-200'>
                                        <button 
                                            className='text-blue-500 hover:underline'
                                            onClick={() => handleUserClick(user.id)}
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </section>
    );
}

export default UserComp;
