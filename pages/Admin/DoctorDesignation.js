/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/button-has-type */
import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { useAuth } from '../../utils/userContext';
import { getOtherUsers, updateUser } from '../../API/userData';

export default function DoctorDesignationPage() {
  const { user } = useAuth(); // Logged-in user context
  const [users, setUsers] = useState([]); // State to hold the list of users

  // Fetch all other users (excluding the logged-in user)
  const fetchUsers = async () => {
    try {
      const otherUsers = await getOtherUsers(user.id);
      setUsers(otherUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Toggle the role between "patient" and "doctor"
  const toggleRole = async (userToUpdate) => {
    const updatedUser = {
      ...userToUpdate,
      role: userToUpdate.role === 'doctor' ? 'patient' : 'doctor',
    };

    try {
      await updateUser(updatedUser); // Update the user in the database
      // Update the local state with the new role
      setUsers((prevUsers) => prevUsers.map((u) => (u.id === updatedUser.id ? { ...u, role: updatedUser.role } : u)));
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Show loading state if `users` is not yet populated
  if (!users.length) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Doctor Designation Page</h1>
      <h2>Welcome, Admin {user.username}!</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Action</th>
            <th>Profile Picture</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((userData) => (
            <tr key={userData.id}>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => toggleRole(userData)}
                >
                  {userData.role === 'doctor' ? 'Demote to Patient' : 'Promote to Doctor'}
                </button>
              </td>
              <td>
                <img
                  src={userData.image_url}
                  alt="Profile"
                  style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                />
              </td>
              <td>{userData.username}</td>
              <td>{userData.email}</td>
              <td>{userData.role}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
