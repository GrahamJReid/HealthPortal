/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/button-has-type */
import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { useAuth } from '../../utils/userContext';
import { getOtherUsers, getUsersWithSearch, updateUser } from '../../API/userData';
import doctorDesignationStyle from '../../styles/Admin/doctorDesignation.module.css';

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
      setUsers((prevUsers) => prevUsers.map((u) => (u.id === updatedUser.id ? { ...u, role: updatedUser.role } : u)));
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  // Guard clause for `user` being null
  if (!user) {
    return (
      <div className={doctorDesignationStyle.container}>
        <h1>You are not logged in!</h1>
      </div>
    );
  }

  // Show loading state while users are being fetched
  if (loading) {
    return (
      <div className={doctorDesignationStyle.container}>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className={doctorDesignationStyle.container}>
      <h1 className={doctorDesignationStyle.title}>Doctor Designation Page</h1>
      <h2 className={doctorDesignationStyle.subtitle}>Welcome, Admin {user.username}!</h2>

      <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={handleSearchInputChange}
        className={doctorDesignationStyle.searchInput}
      />

      <div className={doctorDesignationStyle.tableWrapper}>
        <Table striped bordered hover className={doctorDesignationStyle.table}>
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
                    className={`btn btn-primary ${doctorDesignationStyle.actionButton}`}
                    onClick={() => toggleRole(userData)}
                  >
                    {userData.role === 'doctor' ? 'Demote to Patient' : 'Promote to Doctor'}
                  </button>
                </td>
                <td>
                  <img
                    src={userData.image_url}
                    alt="Profile"
                    className={doctorDesignationStyle.profileImage}
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
    </div>
  );
}
