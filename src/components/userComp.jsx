import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast, ToastContainer} from "react-toastify"; // Import toast and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

function UserComp() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [limit, setLimit] = useState(5);
    const [skip, setSkip] = useState(0);
    const [order, setOrder] = useState("asc");
    const [userPosts, setUserPosts] = useState([]);
    const [userTodos, setUserTodos] = useState([]);
    const [newUser, setNewUser] = useState({
        firstName: "",
        lastName: "",
        age: "",
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                let query = `limit=${limit}&skip=${skip}&order=${order}`;

                const response = await fetch(`https://dummyjson.com/users?${query}`);
                const data = await response.json();
                setUsers(data.users);
                setFilteredUsers(data.users);
            } catch (error) {
                console.error("Ma'lumotlarni olishda xato:", error);
            }
        };

        fetchUsers();
    }, [searchQuery, limit, skip, order]);

    useEffect(() => {
        if (searchQuery) {
            const filtered = users.filter((user) => user.firstName.toLowerCase().includes(searchQuery.toLowerCase()));
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
        }
    }, [searchQuery, users]);

    const handleUserClick = async (userId) => {
        try {
            const postsResponse = await fetch(`https://dummyjson.com/users/${userId}/posts`);
            const postsData = await postsResponse.json();
            setUserPosts(postsData.posts);

            const todosResponse = await fetch(`https://dummyjson.com/users/${userId}/todos`);
            const todosData = await todosResponse.json();
            setUserTodos(todosData.todos);

            navigate(`/detail/${userId}/user`);
        } catch (error) {
            console.error("Foydalanuvchining ma'lumotlarini olishda xato:", error);
        }
    };

    const handleAddUser = async () => {
        try {
            const response = await fetch("https://dummyjson.com/users/add", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
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

                toast.success("Foydalanuvchi muvaffaqiyatli qo'shildi!"); // Success notification
            } else {
                toast.error("Foydalanuvchini qo'shishda xato yuz berdi!"); // Error notification
            }
            setIsModalOpen(false); // Modalni yopish
        } catch (error) {
            console.error("Foydalanuvchini qo'shishda xato:", error);
            toast.error("Foydalanuvchini qo'shishda xato yuz berdi!"); // Error notification
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

                toast.success("Foydalanuvchi muvaffaqiyatli o'chirildi!"); // Success notification
            } else {
                toast.error("Foydalanuvchini o'chirishda xato yuz berdi!"); // Error notification
            }
        } catch (error) {
            console.error("Foydalanuvchini o'chirishda xato:", error);
            toast.error("Foydalanuvchini o'chirishda xato yuz berdi!"); // Error notification
        }
    };

    return (
        <section className="max-w-full m-auto ">
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
                    <div className="flex flex-row w-full sm:w-2/6 justify-between  mt-2 sm:mt-0 items-center">
                        <input
                            type="number"
                            placeholder="Limit"
                            value={limit}
                            onChange={(e) => setLimit(e.target.value)}
                            className="border border-gray-300 px-1 h-10 rounded mr-2 w-28 sm:w-auto"
                        />
                        <input
                            type="number"
                            placeholder="Skip"
                            value={skip}
                            onChange={(e) => setSkip(e.target.value)}
                            className="border border-gray-300 px-1 h-10 rounded mr-2 w-28 sm:w-auto"
                        />
                        <select
                            value={order}
                            onChange={(e) => setOrder(e.target.value)}
                            className="border border-gray-300  px-1 h-10  rounded  sm:w-auto"
                        >
                            <option value="asc">O'sish tartibi</option>
                            <option value="desc">Kamayish tartibi</option>
                        </select>
                    </div>
                </div>

                {/* Modal */}
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
                                onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                                className="border border-gray-300 p-2 rounded mb-2"
                            />
                            <input
                                type="text"
                                placeholder="Familiya"
                                value={newUser.lastName}
                                onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                                className="border border-gray-300 p-2 rounded mb-2"
                            />
                            <input
                                type="number"
                                placeholder="Yoshi"
                                value={newUser.age}
                                onChange={(e) => setNewUser({...newUser, age: e.target.value})}
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
                                <th className="py-3 px-6 bg-gray-100 border-b border-gray-200">Rasm</th>
                                <th className="py-3 px-6 bg-gray-100 border-b border-gray-200">Ism</th>
                                <th className="py-3 px-6 bg-gray-100 border-b border-gray-200">Email</th>
                                <th className="py-3 px-6 bg-gray-100 border-b border-gray-200">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td className="py-3 px-6 border-b border-gray-200">
                                        <img src={user.image} alt={user.firstName} className="w-10 h-10 rounded-full" />
                                    </td>
                                    <td className="py-3 px-6 border-b border-gray-200">
                                        {user.firstName} {user.lastName}
                                    </td>
                                    <td className="py-3 px-6 border-b border-gray-200">{user.email}</td>

                                    <td className="py-3 px-6 border-b border-gray-200">
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="bg-red-500 text-white p-2 rounded"
                                        >
                                            O'chirish
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
            <ToastContainer /> {/* Toast component */}
        </section>
    );
}

export default UserComp;
