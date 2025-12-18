/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/button-has-type */
import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { useAuth } from '../../../utils/userContext';
import { getDoctorPatientByDoctorId } from '../../../API/doctorpatientData';
import { getSingleUser } from '../../../API/userData';
import doctorPatientsStyle from '../../../styles/Doctor/doctorPatients.module.css';

export default function PatientsPage() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    try {
      const assignmentsMap = await getDoctorPatientByDoctorId(user.id);
      if (!assignmentsMap || typeof assignmentsMap !== 'object') return;

      const patientList = await Promise.all(
        Object.keys(assignmentsMap).map(async (patientId) => {
          if (!patientId) return null;
          try {
            const patient = await getSingleUser(patientId);
            return patient || null;
          } catch {
            return null;
          }
        }),
      );

      const filteredPatientList = patientList.filter((p) => p !== null);
      setPatients(filteredPatientList);
      setFilteredPatients(filteredPatientList);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchPatients();
  }, [user]);

  const handleSearchInputChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = patients.filter(
      (p) => p.username.toLowerCase().includes(query)
        || p.email.toLowerCase().includes(query),
    );
    setFilteredPatients(filtered);
  };

  if (loading) return <h1>Loading...</h1>;

  return (
    <div className={doctorPatientsStyle.container}>
      <h1 className={doctorPatientsStyle.title}>Assigned Patients</h1>

      <input
        type="text"
        placeholder="Search patients..."
        value={searchQuery}
        onChange={handleSearchInputChange}
        className={doctorPatientsStyle.searchInput}
      />

      {filteredPatients.length === 0 && searchQuery && (
        <p className={doctorPatientsStyle.noResults}>
          No patients found matching "{searchQuery}"
        </p>
      )}

      <div className={doctorPatientsStyle.tableWrapper}>
        <Table striped bordered hover className={doctorPatientsStyle.table}>
          <thead>
            <tr>
              <th>Profile Picture</th>
              <th>Username</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient.id}>
                <td>
                  <img
                    src={patient.image_url}
                    alt="Patient Profile"
                    className={doctorPatientsStyle.profileImage}
                  />
                </td>
                <td>{patient.username}</td>
                <td>{patient.email}</td>
                <td>
                  <button
                    className={`btn btn-primary ${doctorPatientsStyle.actionButton}`}
                    onClick={() => console.warn(`route to ${patient.id}`)}
                  >
                    View Profile
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
