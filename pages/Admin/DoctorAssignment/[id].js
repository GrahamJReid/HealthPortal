/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/button-has-type */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Table from 'react-bootstrap/Table';
import { getSingleUser, getUsersWithSearch } from '../../../API/userData';
import { createDoctorPatient, deleteDoctorPatient, getDoctorPatientByDoctorId } from '../../../API/doctorpatientData';
import singleDoctorAssignmentStyle from '../../../styles/Admin/singleDoctorAssignment.module.css';

export default function AssignPatientsPage() {
  const router = useRouter();
  const { id } = router.query;

  const [doctor, setDoctor] = useState(null);
  const [patients, setPatients] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch doctor data
  const fetchDoctor = async () => {
    try {
      const doctorData = await getSingleUser(id);
      setDoctor(doctorData);
    } catch (error) {
      console.error('Error fetching doctor data:', error);
    }
  };

  // Fetch patients
  const fetchPatients = async () => {
    try {
      const patientData = await getUsersWithSearch(id, searchQuery);
      const filteredPatients = patientData.filter((user) => user.role === 'patient' && user.admin === false);
      setPatients(filteredPatients);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch assignments
  const fetchAssignments = async () => {
    try {
      const assignmentsMap = await getDoctorPatientByDoctorId(id);
      setAssignments(assignmentsMap);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDoctor();
      fetchPatients();
      fetchAssignments();
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchPatients();
  }, [searchQuery]);

  const handleSearchInputChange = (e) => setSearchQuery(e.target.value);

  const assignPatient = (patient) => {
    const payload = { doctor: doctor.id, patient: patient.id };
    createDoctorPatient(payload)
      .then((data) => {
        window.alert(`Assignment created successfully! Doctor: ${data.doctor.username}, Patient: ${data.patient.username}`);
        setAssignments((prev) => ({ ...prev, [patient.id]: data.id }));
      })
      .catch(() => window.alert('Failed to create assignment. Please try again.'));
  };

  const removeAssignment = (patient) => {
    const assignmentId = assignments[patient.id];
    deleteDoctorPatient(assignmentId)
      .then(() => {
        window.alert(`Assignment removed for Patient: ${patient.username}`);
        setAssignments((prev) => {
          const updated = { ...prev };
          delete updated[patient.id];
          return updated;
        });
      })
      .catch(() => window.alert('Failed to remove assignment. Please try again.'));
  };

  if (loading) return <h1>Loading...</h1>;
  if (!doctor) return <h1>Doctor not found!</h1>;

  return (
    <div className={singleDoctorAssignmentStyle.container}>
      {/* Doctor Info */}
      <div className={singleDoctorAssignmentStyle.doctorInfo}>
        <h1 className={singleDoctorAssignmentStyle.title}>Doctor Assignment Page</h1>
        <div className={singleDoctorAssignmentStyle.doctorDetails}>
          <img src={doctor.image_url} alt="Doctor Profile" className={singleDoctorAssignmentStyle.profileImageLarge} />
          <div>
            <h2 className={singleDoctorAssignmentStyle.subtitle}>{doctor.username}</h2>
            <p>Email: {doctor.email}</p>
            <p>Role: {doctor.role}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search patients..."
        value={searchQuery}
        onChange={handleSearchInputChange}
        className={singleDoctorAssignmentStyle.searchInput}
      />

      {/* Patients Table */}
      <div className={singleDoctorAssignmentStyle.tableWrapper}>
        <Table striped bordered hover className={singleDoctorAssignmentStyle.table}>
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
                      className={`btn btn-danger ${singleDoctorAssignmentStyle.actionButton}`}
                      onClick={() => removeAssignment(patient)}
                    >
                      Remove Assignment
                    </button>
                  ) : (
                    <button
                      className={`btn btn-primary ${singleDoctorAssignmentStyle.actionButton}`}
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
                    className={singleDoctorAssignmentStyle.profileImage}
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
    </div>
  );
}
