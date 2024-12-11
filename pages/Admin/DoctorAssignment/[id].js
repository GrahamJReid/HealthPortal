/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/button-has-type */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Table from 'react-bootstrap/Table';
import { getSingleUser, getUsersWithSearch } from '../../../API/userData';
import { createDoctorPatient, deleteDoctorPatient, getDoctorPatientByDoctorId } from '../../../API/doctorpatientData';

export default function AssignPatientsPage() {
  const router = useRouter();
  const { id } = router.query;

  const [doctor, setDoctor] = useState(null); // Doctor's data
  const [patients, setPatients] = useState([]); // All patients to display
  const [assignments, setAssignments] = useState({}); // Store patient assignments
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [loading, setLoading] = useState(true); // Loading state for better UX

  // Fetch the doctor's data
  const fetchDoctor = async () => {
    try {
      const doctorData = await getSingleUser(id);
      setDoctor(doctorData);
    } catch (error) {
      console.error('Error fetching doctor data:', error);
    }
  };

  // Fetch all patients
  const fetchPatients = async () => {
    try {
      const patientData = await getUsersWithSearch(id, searchQuery); // Fetch patients, excluding the doctor
      const filteredPatients = patientData.filter((user) => user.role === 'patient' && user.admin === false);
      setPatients(filteredPatients);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch assignments for the doctor
  const fetchAssignments = async () => {
    try {
      const assignmentsMap = await getDoctorPatientByDoctorId(id);
      setAssignments(assignmentsMap);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  // Fetch data on component load
  useEffect(() => {
    if (id) {
      fetchDoctor();
      fetchPatients();
      fetchAssignments();
    }
  }, [id]);

  // Fetch patients whenever the search query changes
  useEffect(() => {
    if (id) fetchPatients();
  }, [searchQuery]);

  // Handle search input changes
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Assign patient to doctor
  const assignPatient = (patient) => {
    const payload = {
      doctor: doctor.id,
      patient: patient.id,
    };

    createDoctorPatient(payload)
      .then((data) => {
        window.alert(`Assignment created successfully! Doctor: ${data.doctor.username}, Patient: ${data.patient.username}`);
        setAssignments((prev) => ({ ...prev, [patient.id]: data.id })); // Update assignments
      })
      .catch((error) => {
        console.error('Failed to assign patient:', error);
        window.alert('Failed to create assignment. Please try again.');
      });
  };

  // Remove patient assignment
  const removeAssignment = (patient) => {
    const assignmentId = assignments[patient.id];

    deleteDoctorPatient(assignmentId)
      .then(() => {
        window.alert(`Assignment removed for Patient: ${patient.username}`);
        setAssignments((prev) => {
          const updatedAssignments = { ...prev };
          delete updatedAssignments[patient.id];
          return updatedAssignments;
        });
      })
      .catch((error) => {
        console.error('Failed to remove assignment:', error);
        window.alert('Failed to remove assignment. Please try again.');
      });
  };

  // Show loading state while fetching data
  if (loading) {
    return <h1>Loading...</h1>;
  }

  // Show error if no doctor found
  if (!doctor) {
    return <h1>Doctor not found!</h1>;
  }

  return (
    <div>
      {/* Doctor Information */}
      <div style={{
        marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px',
      }}
      >
        <h1>Doctor Assignment Page</h1>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={doctor.image_url}
            alt="Doctor Profile"
            style={{
              width: '100px', height: '100px', borderRadius: '50%', marginRight: '20px',
            }}
          />
          <div>
            <h2>{doctor.username}</h2>
            <p>Email: {doctor.email}</p>
            <p>Role: {doctor.role}</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search patients..."
        value={searchQuery}
        onChange={handleSearchInputChange}
        style={{ marginBottom: '20px', padding: '10px', width: '100%' }}
      />

      {/* Patients Table */}
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
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>
                {assignments[patient.id] ? (
                  <button
                    className="btn btn-danger"
                    onClick={() => removeAssignment(patient)}
                  >
                    Remove Assignment
                  </button>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => assignPatient(patient)}
                  >
                    Assign to Doctor
                  </button>
                )}
              </td>
              <td>
                <img
                  src={patient.image_url}
                  alt="Patient Profile"
                  style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                />
              </td>
              <td>{patient.username}</td>
              <td>{patient.email}</td>
              <td>{patient.role}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
