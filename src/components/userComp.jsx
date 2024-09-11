import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserComp() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [newUser, setNewUser] = useState({
        firstName: "",
        lastName: "",
        age: "",
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchUsers = async () => {
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
        };

        fetchUsers();
    }, [currentPage]);

    useEffect(() => {
        if (searchQuery) {
            const filtered = users.filter((user) => user.firstName.toLowerCase().includes(searchQuery.toLowerCase()));
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
        }
    }, [searchQuery, users]);

    const handleAddUser = async () => {
        try {
            const response = await fetch("https://dummyjson.com/users/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser),
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Yangi foydalanuvchi:", data);

                setUsers((prevUsers) => [...prevUsers, data]);
                setFilteredUsers((prevUsers) => [...prevUsers, data]);

                setNewUser({
                    firstName: "",
                    lastName: "",
                    age: "",
                });

                toast.success("Foydalanuvchi muvaffaqiyatli qo'shildi!");
            } else {
                toast.error("Foydalanuvchini qo'shishda xato yuz berdi!");
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Foydalanuvchini qo'shishda xato:", error);
            toast.error("Foydalanuvchini qo'shishda xato yuz berdi!");
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            const response = await fetch(`https://dummyjson.com/users/${userId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                const data = await response.json();
                console.log("O'chirilgan foydalanuvchi:", data);

                setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
                setFilteredUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));

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
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
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
        <section className="max-w-full m-auto">
            <main className="max-w-7xl m-auto p-4">
                <div className="flex flex-row w-full mb-4 gap-3 sticky top-1 bg-stone-50 flex-wrap">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-lg w-full sm:w-1/6"
                    >
                        Yangi foydalanuvchi qo'shish
                    </button>
                    <input
                        type="text"
                        placeholder="Foydalanuvchilarni qidirish..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border border-gray-300 p-2 rounded-lg mr-2 w-full sm:w-2/6 mt-2 sm:mt-0"
                    />
                </div>

                {/* User Details Modal */}
                {isUserDetailsModalOpen && selectedUser && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded shadow-lg relative w-full max-w-lg">
                            <button
                                onClick={() => setIsUserDetailsModalOpen(false)}
                                className="absolute top-2 right-2 text-gray-600"
                            >
                                &times;
                            </button>
                            <h2 className="text-xl mb-4">Foydalanuvchi Ma'lumotlari</h2>
                            <p><strong>ID:</strong> {selectedUser.id}</p>
                            <p><strong>Ism:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
                            <p><strong>Email:</strong> {selectedUser.email}</p>
                            <p><strong>Yoshi:</strong> {selectedUser.age}</p>
                            <img src={selectedUser.image} alt={selectedUser.firstName} className="w-32 h-32 rounded-full mt-4" />
                        </div>
                    </div>
                )}

                {/* Add User Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded shadow-lg relative">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-2 right-2 text-gray-600"
                            >
                                &times;
                            </button>
                            <h2 className="text-xl mb-4">Yangi foydalanuvchi qo'shish</h2>
                            <input
                                type="text"
                                placeholder="Ism"
                                value={newUser.firstName}
                                onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                                className="border border-gray-300 p-2 rounded mb-2"
                            />
                            <input
                                type="text"
                                placeholder="Familiya"
                                value={newUser.lastName}
                                onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                                className="border border-gray-300 p-2 rounded mb-2"
                            />
                            <input
                                type="number"
                                placeholder="Yoshi"
                                value={newUser.age}
                                onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
                                className="border border-gray-300 p-2 rounded mb-2"
                            />
                            <button onClick={handleAddUser} className="bg-green-500 text-white p-2 rounded">
                                Qo'shish
                            </button>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr>
                                <th className="py-3 px-6 bg-gray-100 border-b border-gray-200">ID</th>
                                <th className="py-3 px-6 bg-gray-100 border-b border-gray-200">Rasm</th>
                                <th className="py-3 px-6 bg-gray-100 border-b border-gray-200">Ism</th>
                                <th className="py-3 px-6 bg-gray-100 border-b border-gray-200">Email</th>
                                <th className="py-3 px-6 bg-gray-100 border-b border-gray-200">Aksiya</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td className="py-3 px-6 border-b border-gray-200">
                                        {user.id}
                                    </td>
                                    <td className="py-3 px-6 border-b border-gray-200">
                                        <img src={user.image} alt={user.firstName} className="w-10 h-10 rounded-full" />
                                    </td>
                                    <td className="py-3 px-6 border-b border-gray-200">
                                        {user.firstName} {user.lastName}
                                    </td>
                                    <td className="py-3 px-6 border-b border-gray-200">{user.email}</td>
                                    <td className="py-3 px-6 border-b border-gray-200">
                                        <button
                                            onClick={() => handleUserClick(user.id)}
                                            className="bg-blue-500 text-white p-2 rounded"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevents modal from opening when delete button is clicked
                                                handleDeleteUser(user.id);
                                            }}
                                            className="bg-red-500 text-white p-2 rounded ml-2"
                                        >
                                            O'chirish
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="bg-blue-500 text-white px-3 py-1 rounded-lg"
                    >
                        Oldingi
                    </button>
                    <span className="text-gray-700">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="bg-blue-500 text-white px-3 py-1 rounded-lg"
                    >
                        Keyingi
                    </button>
                </div>
            </main>
            <ToastContainer />
        </section>
    );
}

export default UserComp;
