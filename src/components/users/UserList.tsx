import React, { useState, useEffect } from "react";
import { getAllUsers, createUser, updateUser, deleteUser } from "../../services/userService";
import type { User } from "../../types/User";
import UserForm from "./UserForm";
import "./UserList.css";

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
      setError(null);
    } catch (error: unknown) {
      console.error("Error loading users:", error);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = (): void => {
    setEditingUser(undefined);
    setShowForm(true);
  };

  const handleEditUser = (user: User): void => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleSaveUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, userData);
      } else {
        await createUser(userData);
      }

      setShowForm(false);
      setEditingUser(undefined);
      loadUsers();
    } catch (error: unknown) {
      console.error("Error saving user:", error);
      setError("Failed to save user");
    }
  };

  const handleDeleteUser = async (userId: string): Promise<void> => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
        loadUsers();
      } catch (error: unknown) {
        console.error("Error deleting user:", error);
        setError("Failed to delete user");
      }
    }
  };

  const handleCancelForm = (): void => {
    setShowForm(false);
    setEditingUser(undefined);
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>User List</h2>
        <button type="button" className="create-user-button" onClick={handleCreateUser}>
          + Create User
        </button>
      </div>
      <p>Total users: {users.length}</p>

      <table border={1} style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign: "center" }}>
                There are no users to display.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>{new Date(user.updatedAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleEditUser(user)}>Edit</button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    style={{
                      backgroundColor: "#f44336",
                      color: "white",
                      marginLeft: "5px",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Formulario modal - Solo se muestra si showForm es true */}
      {showForm && (
        <UserForm
          user={editingUser}
          onSave={handleSaveUser}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  );
};

export default UserList;