/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/button-has-type */
import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { useAuth } from '../../utils/userContext';
import { getOtherUsers, getUsersWithSearch, updateUser } from '../../API/userData';

export default function DoctorDesignationPage() {
  const { user } = useAuth(); // Logged-in user context
  const [users, setUsers] = useState([]); // All users to display
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [loading, setLoading] = useState(true); // Loading state for better UX

  // Fetch all other users initially
  const fetchAllUsers = async () => {
    try {
      if (user && user.id) {
        const otherUsers = await getOtherUsers(user.id);
        setUsers(otherUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users based on search query
  const fetchFilteredUsers = async () => {
    try {
      if (user && user.id && searchQuery) {
        const filteredUsers = await getUsersWithSearch(user.id, searchQuery);
        setUsers(filteredUsers); // Replace users with filtered results
      } else {
        await fetchAllUsers(); // If no query, fetch all users again
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch all users on initial load
  useEffect(() => {
    fetchAllUsers();
    document.title = 'Doctor Designation Page';
  }, [user]);

  // Fetch users whenever the search query changes
  useEffect(() => {
    fetchFilteredUsers();
  }, [searchQuery]);

  // Handle search input changes
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
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

  // Guard clause for `user` being null
  if (!user) {
    return (
      <div>
        <h1>You are not logged in!</h1>
      </div>
    );
  }

  // Show loading state while users are being fetched
  if (loading) {
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
      <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={handleSearchInputChange}
      />
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
