/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/button-has-type */
import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { useRouter } from 'next/router';
import { useAuth } from '../../../utils/userContext';
import { getOtherUsers } from '../../../API/userData';
import doctorAssignmentStyle from '../../../styles/Admin/doctorAssignment.module.css';

export default function DoctorAssignmentPage() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch all doctors
  const fetchDoctors = async () => {
    try {
      if (user && user.id) {
        const users = await getOtherUsers(user.id);
        const doctorsOnly = users.filter((item) => item.role === 'doctor');
        setDoctors(doctorsOnly);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
    document.title = 'Doctor Assignment Page';
  }, [user]);

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredDoctors = doctors.filter(
    (doctor) => !searchQuery
      || doctor.username.toLowerCase().includes(searchQuery.toLowerCase())
      || doctor.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleRowClick = (doctorId) => {
    router.push(`/Admin/DoctorAssignment/${doctorId}/`);
  };

  if (!user) {
    return (
      <div className={doctorAssignmentStyle.container}>
        <h1>You are not logged in!</h1>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={doctorAssignmentStyle.container}>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className={doctorAssignmentStyle.container}>
      <h1 className={doctorAssignmentStyle.title}>Doctor Assignment Page</h1>
      <h2 className={doctorAssignmentStyle.subtitle}>Welcome, Admin {user.username}!</h2>

      <input
        type="text"
        placeholder="Search doctors..."
        value={searchQuery}
        onChange={handleSearchInputChange}
        className={doctorAssignmentStyle.searchInput}
      />

      <div className={doctorAssignmentStyle.tableWrapper}>
        <Table striped bordered hover className={doctorAssignmentStyle.table}>
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
              <tr
                key={doctor.id}
                onClick={() => handleRowClick(doctor.id)}
                className={doctorAssignmentStyle.tableRow}
              >
                <td>
                  <img
                    src={doctor.image_url || '/default-profile.png'}
                    alt="Profile"
                    className={doctorAssignmentStyle.profileImage}
                  />
                </td>
                <td>{doctor.username}</td>
                <td>{doctor.email}</td>
                <td>
                  <button
                    className={`btn btn-primary ${doctorAssignmentStyle.actionButton}`}
                    onClick={(e) => {
                      e.stopPropagation();
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
    </div>
  );
}
