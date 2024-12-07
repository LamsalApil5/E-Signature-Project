import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserFormProps {
  userToEdit?: User | null; // Allow null as a valid value for userToEdit
  onSave: (user: User) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ userToEdit, onSave, onCancel }) => {
  const [user, setUser] = useState<User>({
    id: '',
    name: '',
    email: ''
  });

  // If there's a userToEdit, populate the form with existing data
  useEffect(() => {
    if (userToEdit) {
      setUser(userToEdit);
    } else {
      setUser({
        id: '',
        name: '',
        email: ''
      }); // Reset the form if no userToEdit is provided
    }
  }, [userToEdit]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value
    }));
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(user);
  };

  return (
    <div className="modal-content p-6 max-w-4xl mx-auto">
      <h3 className="text-2xl font-semibold mb-6">{user.id ? 'Edit User' : 'Add User'}</h3>
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
        <div className="flex justify-end gap-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-lg"
          >
            {user.id ? 'Update' : 'Create'}
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
