import { USERS_CREATE, USERS_UPDATE } from '@/endpoints';
import { api } from '@/Services/apiService';
import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Make password optional to handle cases where it might not be returned
}

interface UserFormProps {
  userToEdit?: User | null;
  onSave: (user: User) => void; // Callback to notify parent about changes
  onCancel: () => void; // Callback to close the form
}

const UserForm: React.FC<UserFormProps> = ({ userToEdit, onSave, onCancel }) => {
  const [user, setUser] = useState<User>({
    id: '',
    name: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Populate form if editing a user
  useEffect(() => {
    if (userToEdit) {
      setUser(userToEdit);
    } else {
      setUser({
        id: '',
        name: '',
        email: '',
        password: '',
      });
    }
  }, [userToEdit]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (user.id) {
        // Update user if `id` exists
        await api.update<User>(USERS_UPDATE, user);
        alert('User updated successfully');
      } else {
        // Create a new user if `id` does not exist
        await api.create<User>(USERS_CREATE, user);
        alert('User created successfully');
      }

      // Clear form and close modal after success
      setUser({ id: '', name: '', email: '', password: '' }); // Reset form
      onCancel(); // Close modal
      onSave(user); // Notify parent component (optional)
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-content p-6 max-w-4xl mx-auto">
      <h3 className="text-2xl font-semibold mb-6">
        {user.id ? 'Edit User' : 'Add User'}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700">Name:</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleInputChange}
            className="mt-2 p-3 w-full border border-gray-300 rounded-md text-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700">Email:</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleInputChange}
            className="mt-2 p-3 w-full border border-gray-300 rounded-md text-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700">Password:</label>
          <input
            type="password"
            name="password"
            value={user.password || ''} // Ensure it's not undefined
            onChange={handleInputChange}
            className="mt-2 p-3 w-full border border-gray-300 rounded-md text-lg"
            required={!user.id} // Make password required only for creating a new user
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-lg"
          >
            {isLoading ? 'Saving...' : user.id ? 'Update' : 'Create'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 text-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
