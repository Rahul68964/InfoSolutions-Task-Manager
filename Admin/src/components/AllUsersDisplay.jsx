import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllUsersDisplay = ({ onDone, setAddMember }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [users, setUsers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const response = await axios.get(`${backendUrl}/admin/getallusers`);
        if (response.data.success) {
          setUsers(response.data.users);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    getAllUsers();
  }, [backendUrl]);

  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDone = () => {
    const selectedUsers = users.filter((user) => selectedIds.includes(user._id));
    onDone(selectedUsers);
    setAddMember(false);
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 mt-4 max-w-md w-full mx-auto">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Select Members:</h3>
      {users.length === 0 ? (
        <p className="text-gray-500 text-sm">Loading users...</p>
      ) : (
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user._id} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`user-${user._id}`}
                checked={selectedIds.includes(user._id)}
                onChange={() => toggleSelection(user._id)}
                className="accent-blue-600 w-4 h-4"
              />
              <label htmlFor={`user-${user._id}`} className="text-gray-700 cursor-pointer">
                {user.name}
              </label>
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={handleDone}
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200 w-full"
      >
        Done
      </button>
    </div>
  );
};

export default AllUsersDisplay;
