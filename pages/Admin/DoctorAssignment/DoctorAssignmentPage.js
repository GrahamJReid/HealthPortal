/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/button-has-type */
import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { useRouter } from 'next/router'; // For navigation
import { useAuth } from '../../../utils/userContext';
import { getOtherUsers } from '../../../API/userData'; // Update as needed for fetching users

export default function DoctorAssignmentPage() {
  const { user } = useAuth(); // Logged-in user context
  const [doctors, setDoctors] = useState([]); // Doctors to display
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [loading, setLoading] = useState(true); // Loading state for better UX
  const router = useRouter(); // For navigation to individual doctor pages

  // Fetch all doctors
  const fetchDoctors = async () => {
    try {
      if (user && user.id) {
        const users = await getOtherUsers(user.id); // Fetch all users
        const doctorsOnly = users.filter((item) => item.role === 'doctor'); // Filter by role
        setDoctors(doctorsOnly);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch doctors on initial load
  useEffect(() => {
    fetchDoctors();
    document.title = 'Doctor Assignment Page';
  }, [user]);

  // Handle search input changes
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter doctors based on the search query
  const filteredDoctors = doctors.filter(
    (doctor) => !searchQuery
      || doctor.username.toLowerCase().includes(searchQuery.toLowerCase())
      || doctor.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Navigate to the individualized page for a doctor
  const handleRowClick = (doctorId) => {
    router.push(`/Admin/DoctorAssignment/${doctorId}/`); // Adjust route as needed
  };

  // Guard clause for `user` being null
  if (!user) {
    return (
      <div>
        <h1>You are not logged in!</h1>
      </div>
    );
  }

  // Show loading state while doctors are being fetched
  if (loading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Doctor Assignment Page</h1>
      <h2>Welcome, Admin {user.username}!</h2>
      <input
        type="text"
        placeholder="Search doctors..."
        value={searchQuery}
        onChange={handleSearchInputChange}
      />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Profile Picture</th>
            <th>Username</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDoctors.map((doctor) => (
            <tr key={doctor.id} onClick={() => handleRowClick(doctor.id)} style={{ cursor: 'pointer' }}>
              <td>
                <img
                  src={doctor.image_url || '/default-profile.png'}
                  alt="Profile"
                  style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                />
              </td>
              <td>{doctor.username}</td>
              <td>{doctor.email}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent row click event
                    handleRowClick(doctor.id);
                  }}
                >
                  Assign Patients
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
