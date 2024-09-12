import React, { useEffect, useState, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const itemsPerPage = 10;

function UserComp() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [newUser, setNewUser] = useState({ firstName: "", lastName: "", age: "" });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchUsers = useCallback(async () => {
        try {
            const skip = (currentPage - 1) * itemsPerPage;
            const response = await fetch(`https://dummyjson.com/users?limit=${itemsPerPage}&skip=${skip}`);
            const data = await response.json();
            setUsers(data.users);
            setFilteredUsers(data.users);
            setTotalPages(Math.ceil(data.total / itemsPerPage)); // Total pages calculation
        } catch (error) {
            console.error("Ma'lumotlarni olishda xato:", error);
        }
    }, [currentPage]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        const filtered = searchQuery
            ? users.filter(user => user.firstName.toLowerCase().includes(searchQuery.toLowerCase()))
            : users;
        setFilteredUsers(filtered);
    }, [searchQuery, users]);

    const handleAddUser = async () => {
        if (!newUser.firstName || !newUser.lastName || !newUser.age) {
            toast.error("Iltimos, barcha maydonlarni to'ldiring!");
            return;
        }

        try {
            const response = await fetch("https://dummyjson.com/users/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser),
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(prev => [...prev, data]);
                setFilteredUsers(prev => [...prev, data]);
                setNewUser({ firstName: "", lastName: "", age: "" });
                toast.success("Foydalanuvchi muvaffaqiyatli qo'shildi!");
            } else {
                toast.error("Foydalanuvchini qo'shishda xato yuz berdi!");
            }
        } catch (error) {
            console.error("Foydalanuvchini qo'shishda xato:", error);
            toast.error("Foydalanuvchini qo'shishda xato yuz berdi!");
        } finally {
            setIsModalOpen(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            const response = await fetch(`https://dummyjson.com/users/${userId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setUsers(prev => prev.filter(user => user.id !== userId));
                setFilteredUsers(prev => prev.filter(user => user.id !== userId));
                toast.success("Foydalanuvchi muvaffaqiyatli o'chirildi!");
            } else {
                toast.error("Foydalanuvchini o'chirishda xato yuz berdi!");
            }
        } catch (error) {
            console.error("Foydalanuvchini o'chirishda xato:", error);
            toast.error("Foydalanuvchini o'chirishda xato yuz berdi!");
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleUserClick = async (userId) => {
        try {
            const response = await fetch(`https://dummyjson.com/users/${userId}`);
            const data = await response.json();
            setSelectedUser(data);
            setIsUserDetailsModalOpen(true);
        } catch (error) {
            console.error("Foydalanuvchi ma'lumotlarini olishda xato:", error);
            toast.error("Foydalanuvchi ma'lumotlarini olishda xato yuz berdi!");
        }
    };

    return (
        <section className="max-w-full mx-auto p-4">
            <main className="max-w-7xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row mb-4 gap-3 bg-white p-4 rounded-lg shadow-sm">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-300 hover:bg-blue-700"
                    >
                        Yangi foydalanuvchi qo'shish
                    </button>
                    <input
                        type="text"
                        placeholder="Foydalanuvchilarni qidirish..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border border-gray-300 p-2 rounded-lg mt-2 sm:mt-0 w-full sm:w-2/5"
                    />
                </div>

                {/* User Details Modal */}
                {isUserDetailsModalOpen && selectedUser && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-md">
                            <button
                                onClick={() => setIsUserDetailsModalOpen(false)}
                                className="absolute top-2 right-2 text-gray-600 text-2xl"
                            >
                                &times;
                            </button>
                            <h2 className="text-2xl font-semibold mb-4">Foydalanuvchi Ma'lumotlari</h2>
                            <div className="flex items-center mb-4">
                                <img src={selectedUser.image} alt={selectedUser.firstName} className="w-24 h-24 rounded-full mr-4" />
                                <div>
                                    <p><strong>ID:</strong> {selectedUser.id}</p>
                                    <p><strong>Ism:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
                                    <p><strong>Email:</strong> {selectedUser.email}</p>
                                    <p><strong>Yoshi:</strong> {selectedUser.age}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add User Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-2 right-2 text-gray-600 text-2xl"
                            >
                                &times;
                            </button>
                            <h2 className="text-2xl font-semibold mb-4">Yangi foydalanuvchi qo'shish</h2>
                            <input
                                type="text"
                                placeholder="Ism"
                                value={newUser.firstName}
                                onChange={(e) => setNewUser(prev => ({ ...prev, firstName: e.target.value }))}
                                className="border border-gray-300 p-2 rounded mb-2 w-full"
                            />
                            <input
                                type="text"
                                placeholder="Familiya"
                                value={newUser.lastName}
                                onChange={(e) => setNewUser(prev => ({ ...prev, lastName: e.target.value }))}
                                className="border border-gray-300 p-2 rounded mb-2 w-full"
                            />
                            <input
                                type="number"
                                placeholder="Yoshi"
                                value={newUser.age}
                                onChange={(e) => setNewUser(prev => ({ ...prev, age: e.target.value }))}
                                className="border border-gray-300 p-2 rounded mb-4 w-full"
                            />
                            <button onClick={handleAddUser} className="bg-green-600 text-white p-2 rounded-lg w-full transition duration-300 hover:bg-green-700">
                                Qo'shish
                            </button>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto mt-4">
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 border-b">ID</th>
                                <th className="py-3 px-4 border-b">Rasm</th>
                                <th className="py-3 px-4 border-b">Ism</th>
                                <th className="py-3 px-4 border-b">Email</th>
                                <th className="py-3 px-4 border-b">Aksiya</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4">{user.id}</td>
                                    <td className="py-3 px-4">
                                        <img src={user.image} alt={user.firstName} className="w-12 h-12 rounded-full" />
                                    </td>
                                    <td className="py-3 px-4">
                                        {user.firstName} {user.lastName}
                                    </td>
                                    <td className="py-3 px-4">{user.email}</td>
                                    <td className="py-3 px-4">
                                        <button
                                            onClick={() => handleUserClick(user.id)}
                                            className="bg-blue-600 text-white px-3 py-1 rounded-lg mr-2 transition duration-300 hover:bg-blue-700"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteUser(user.id);
                                            }}
                                            className="bg-red-600 text-white px-3 py-1 rounded-lg transition duration-300 hover:bg-red-700"
                                        >
                                            O'chirish
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center mt-6">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-300 hover:bg-blue-700"
                    >
                        Previous
                    </button>
                    <span className="text-gray-700">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-300 hover:bg-blue-700"
                    >
                        Next
                    </button>
                </div>
            </main>
            <ToastContainer />
        </section>
    );
}

export default UserComp;
