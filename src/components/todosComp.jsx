import React, { useState, useEffect } from 'react';

const TodosComp = () => {
  const [todos, setTodos] = useState([]); // State to store all todos
  const [singleTodo, setSingleTodo] = useState(null); // State to store the single todo (for random or specific ID)
  const [limit, setLimit] = useState(30); // Limit for pagination
  const [skip, setSkip] = useState(0); // Skip for pagination
  const [totalTodos, setTotalTodos] = useState(0); // Total todos for pagination
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal
  const [newTodo, setNewTodo] = useState(''); // State to manage the new todo input

  // Fetch all todos
  useEffect(() => {
    fetch(`https://dummyjson.com/todos?limit=${limit}&skip=${skip}`)
      .then((res) => res.json())
      .then((data) => {
        setTodos(data.todos);
        setTotalTodos(data.total || 0); // Update totalTodos if available
      })
      .catch((error) => console.error('Error fetching todos:', error));
  }, [limit, skip]);

  // Fetch single todo by ID
  const fetchSingleTodo = (id) => {
    fetch(`https://dummyjson.com/todos/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSingleTodo(data);
        setIsModalOpen(true); // Open the modal after fetching todo details
      })
      .catch((error) => console.error('Error fetching single todo:', error));
  };

  // Fetch random todo
  const fetchRandomTodo = () => {
    fetch('https://dummyjson.com/todos/random')
      .then((res) => res.json())
      .then((data) => {
        setSingleTodo(data);
        setIsModalOpen(true); // Open modal to display random todo
      })
      .catch((error) => console.error('Error fetching random todo:', error));
  };

  // Close modal function
  const closeModal = () => {
    setIsModalOpen(false);
    setSingleTodo(null); // Clear the single todo when the modal is closed
  };

  // Add a new todo
  const addNewTodo = () => {
    fetch('https://dummyjson.com/todos/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        todo: newTodo,
        completed: false,
        userId: 5, // You can customize this or take it from input
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // Simulate adding the todo locally
        setTodos((prevTodos) => [...prevTodos, data]);
        setNewTodo(''); // Clear the input after adding the todo
      })
      .catch((error) => console.error('Error adding new todo:', error));
  };

  // Update a todo (toggle completed status)
  const updateTodoStatus = (id, currentStatus) => {
    fetch(`https://dummyjson.com/todos/${id}`, {
      method: 'PUT', // You can also use PATCH
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        completed: !currentStatus, // Toggle the completion status
      }),
    })
      .then((res) => res.json())
      .then((updatedTodo) => {
        // Update the todo in the local state
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === id ? { ...todo, completed: updatedTodo.completed } : todo
          )
        );
      })
      .catch((error) => console.error('Error updating todo:', error));
  };

  // Delete a todo
  const deleteTodo = (id) => {
    fetch(`https://dummyjson.com/todos/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((deletedTodo) => {
        console.log('Deleted Todo:', deletedTodo);
        // Remove the deleted todo from the local state
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      })
      .catch((error) => console.error('Error deleting todo:', error));
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalTodos / limit);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setSkip((newPage - 1) * limit);
    }
  };

  return (
    <section className='w-full mx-auto'>
      <main className='max-w-7xl p-4 mx-auto'>
        <h1 className='text-2xl font-bold mb-4'>Todo List</h1>

        {/* Input for new todo */}
        <div className='flex mb-4 flex-row justify-between sticky top-0 bg-stone-50 p-4 rounded-lg'>
          <input
            type='text'
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder='Add new todo...'
            className='border border-gray-300 p-2 rounded-lg mr-2 w-3/6'
          />
          <button
            onClick={addNewTodo}
            className='bg-blue-500 text-white px-4 py-2 rounded-lg w-1/5'
          >
            Add Todo
          </button>
          <button
            onClick={fetchRandomTodo}
            className='px-4 py-2 bg-green-500 text-white rounded-lg w-1/5'
          >
            Get Random Todo
          </button>
        </div>

        {/* Table of todos */}
        <table className='table-auto w-full border-collapse'>
          <thead>
            <tr className='bg-gray-200'>
              <th className='border p-2'>ID</th>
              <th className='border p-2'>Task</th>
              <th className='border p-2'>Status</th>
              <th className='border p-2'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo) => (
              <tr
                key={todo.id}
                className={`${todo.completed ? 'bg-green-100' : ''}`}
              >
                <td className='border p-2'>{todo.id}</td>
                <td className='border p-2'>{todo.todo}</td>
                <td className='border p-2 text-center'>
                  {/* Checkbox to toggle completion status */}
                  <input
                    type='checkbox'
                    checked={todo.completed}
                    onChange={() => updateTodoStatus(todo.id, todo.completed)}
                    className='mr-2'
                  />
                </td>
                <td className='border p-2 flex flex-row gap-4'>
                  <button
                    className='text-white bg-blue-500 px-3 py-2 border-none rounded-xl'
                    onClick={() => fetchSingleTodo(todo.id)}
                  >
                    View Details
                  </button>
                  <button
                    className='text-white bg-red-500 px-3 py-2 border-none rounded-xl'
                    onClick={() => deleteTodo(todo.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination buttons */}
        <div className='flex justify-between mt-4'>
          <button
            onClick={() => handlePageChange(Math.max(1, (skip / limit) + 1) - 1)}
            disabled={skip === 0}
            className={`px-4 py-2 bg-blue-500 text-white rounded-lg ${
              skip === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Previous
          </button>
          <span>Page {Math.floor(skip / limit) + 1} of {totalPages}</span>
          <button
            onClick={() => handlePageChange(Math.min(totalPages, (skip / limit) + 1) + 1)}
            disabled={skip + limit >= totalTodos}
            className={`px-4 py-2 bg-blue-500 text-white rounded-lg ${
              skip + limit >= totalTodos ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Next
          </button>
        </div>
      </main>

      {/* Modal for single todo details */}
      {isModalOpen && singleTodo && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-6 rounded-lg w-1/2'>
            <h2 className='text-xl font-semibold mb-4'>Todo Details</h2>
            <p><strong>ID:</strong> {singleTodo.id}</p>
            <p><strong>Title:</strong> {singleTodo.todo}</p>
            <p><strong>Status:</strong> {singleTodo.completed ? 'Completed' : 'Not Completed'}</p>
            <button
              onClick={closeModal}
              className='mt-4 bg-red-500 text-white px-4 py-2 rounded-lg'
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default TodosComp;
