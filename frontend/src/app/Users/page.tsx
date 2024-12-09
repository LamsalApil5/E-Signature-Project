"use client"; // Add this directive at the top of the file

import React, { useState, useEffect } from "react";
import UserForm from "./form";
import { api } from "@/Services/apiService"; // Assuming your apiService is setup correctly
import { USERS_LIST } from "@/endpoints"; // Assuming you have the USERS_LIST endpoint

interface User {
  id: string;
  name: string;
  email: string;
}

const UserPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]); // State to store users
  const [showModal, setShowModal] = useState<boolean>(false); // For managing modal visibility
  const [userToEdit, setUserToEdit] = useState<User | null>(null); // For editing a specific user
  const [isLoading, setIsLoading] = useState<boolean>(false); // For showing loading state
  const [currentPage, setCurrentPage] = useState<number>(1); // Current page number
  const [itemsPerPage] = useState<number>(5); // Number of users per page
  const [totalUsers, setTotalUsers] = useState<number>(0); // Total users count
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false); // For delete confirmation modal visibility
  const [userToDelete, setUserToDelete] = useState<User | null>(null); // Store the user to delete

  // Fetch users from API when the component mounts or when the page changes
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await api.list<User[]>(
          `${USERS_LIST}?page=${currentPage}&limit=${itemsPerPage}`
        );
        if (response && Array.isArray(response)) {
          setUsers(response);
        } else {
          alert("No data returned from the server.");
        }
      } catch (error: any) {
        alert("Error fetching users: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch total user count for pagination
    const fetchTotalUsers = async () => {
      try {
        const response = await api.list<User[]>(USERS_LIST); // Assuming this returns all users
        setTotalUsers(response.data.length); // Set total users count
      } catch (error: any) {
        alert("Error fetching total user count: " + error.message);
      }
    };

    fetchUsers();
    fetchTotalUsers();
  }, [currentPage, itemsPerPage]);

  // Open modal for adding a user
  const handleAddUser = () => {
    setUserToEdit(null); // Reset form for adding a new user
    setShowModal(true); // Show modal
  };

  // Open modal for editing a user
  const handleEditUser = (user: User) => {
    setUserToEdit(user); // Populate form with the user to edit
    setShowModal(true); // Show modal
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
        { ...user, id: Math.random().toString(36).substring(7) }, // Generate random ID for demo
      ]);
    }
    setShowModal(false); // Close modal after saving
  };

  // Handle user deletion
  const handleDeleteUser = async () => {
    if (userToDelete) {
      try {
        await api.delete(USERS_LIST + `/${userToDelete.id}`); // Assuming there's a DELETE method available
        setUsers(users.filter((user) => user.id !== userToDelete.id)); // Remove the user from the list
        setShowDeleteModal(false); // Close delete modal
        setUserToDelete(null); // Clear the user to delete
      } catch (error: any) {
        alert("Error deleting user: " + error.message); // Display error if deletion fails
      }
    }
  };

  // Open delete confirmation modal
  const confirmDelete = (user: User) => {
    setUserToDelete(user); // Set the user to delete
    setShowDeleteModal(true); // Show delete confirmation modal
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false); // Close the delete confirmation modal
    setUserToDelete(null); // Clear user to delete
  };

  // Pagination handlers
  const totalPages = Math.ceil(totalUsers / itemsPerPage); // Calculate total pages
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page); // Set current page
    }
  };

  return (
    <div className="p-6 px-64 max-w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">User Management</h2>
        <button
          onClick={handleAddUser}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Add User
        </button>
      </div>

      {/* User Table */}
      <table className="min-w-full bg-white border border-gray-200 shadow-sm ">
        <thead>
          <tr>
            <th className="py-2 px-4 text-left border-b">Name</th>
            <th className="py-2 px-4 text-left border-b">Email</th>
            <th className="py-2 px-4 text-left border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={3} className="text-center py-4">
                Loading...
              </td>
            </tr>
          ) : (
            users.map((user) => (
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
                    onClick={() => confirmDelete(user)} // Open delete confirmation modal
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal for Add/Edit User */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="modal p-4 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
            <UserForm
              userToEdit={userToEdit}
              onSave={handleSaveUser}
              onCancel={() => setShowModal(false)}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="modal p-4 bg-white rounded-lg shadow-lg max-w-sm mx-auto">
            <h3 className="text-xl font-semibold mb-4">
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-between">
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Yes, Delete
              </button>
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;
