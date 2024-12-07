'use client';  // Add this directive at the top of the file

import React, { useState } from 'react';
import UserForm from './form';

interface User {
  id: string;
  name: string;
  email: string;
}

const UserPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  // Open modal for adding a user
  const handleAddUser = () => {
    setUserToEdit(null); // Reset form for adding a new user
    setShowModal(true);
  };

  // Open modal for editing a user
  const handleEditUser = (user: User) => {
    setUserToEdit(user); // Populate form with the user to edit
    setShowModal(true);
  };

  // Save user (add or update)
  const handleSaveUser = (user: User) => {
    if (user.id) {
      // Update user
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === user.id ? { ...u, ...user } : u))
      );
    } else {
      // Add new user
      setUsers((prevUsers) => [
        ...prevUsers,
        { ...user, id: Math.random().toString(36).substring(7) } // Generate random ID for demo
      ]);
    }
    setShowModal(false);
  };

  // Handle user deletion
  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">User Management</h2>
      <button
        onClick={handleAddUser}
        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mb-4"
      >
        Add User
      </button>

      {/* User Table */}
      <table className="min-w-full bg-white border border-gray-200 shadow-sm">
        <thead>
          <tr>
            <th className="py-2 px-4 text-left border-b">Name</th>
            <th className="py-2 px-4 text-left border-b">Email</th>
            <th className="py-2 px-4 text-left border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b">{user.name}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleEditUser(user)}
                  className="px-4 py-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 ml-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Add/Edit User */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="modal p-4 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
            <UserForm userToEdit={userToEdit} onSave={handleSaveUser} onCancel={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;
