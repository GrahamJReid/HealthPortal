/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/button-has-type */
import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { useAuth } from '../../../utils/userContext';
import { getDoctorPatientByDoctorId } from '../../../API/doctorpatientData';
import { getSingleUser } from '../../../API/userData';

export default function PatientsPage() {
  const { user } = useAuth(); // Get the logged-in user
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the doctor's assigned patients
  const fetchPatients = async () => {
    try {
      const assignmentsMap = await getDoctorPatientByDoctorId(user.id);
      console.warn('Assignments Map:', assignmentsMap); // Log the full assignmentsMap

      // Ensure assignmentsMap is an object, not null/undefined
      if (!assignmentsMap || typeof assignmentsMap !== 'object') {
        console.error('Invalid assignmentsMap format or empty data');
        return;
      }

      // Create an array of promises that fetch each patient based on their patientId (key in the map)
      const patientList = await Promise.all(
        Object.keys(assignmentsMap).map(async (patientId) => {
          // eslint-disable-next-line no-unused-vars
          const doctorPatientId = assignmentsMap[patientId]; // The value in assignmentsMap is doctorPatientId

          if (patientId) {
            try {
              // Fetch patient details by patientId
              const patient = await getSingleUser(patientId); // Get the full patient object
              if (patient) {
                return patient; // Return the full patient object if found
              }
              console.error(`No patient data found for ID: ${patientId}`);
              return null; // Return null if no patient data is found
            } catch (error) {
              console.error(`Error fetching patient data for ID: ${patientId}`, error);
              return null; // Return null in case of error
            }
          } else {
            console.error(`No valid patientId in assignment for key: ${patientId}`);
            return null; // Return null if there's no valid patientId
          }
        }),
      );

      // Filter out any null values (in case there were errors or no data)
      const filteredPatientList = patientList.filter((patient) => patient !== null);

      console.warn('Filtered Patient List:', filteredPatientList); // Log the filtered patient list

      // Update the state with the filtered patient list
      setPatients(filteredPatientList);
      setFilteredPatients(filteredPatientList); // Initialize filtered patients
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input changes
  const handleSearchInputChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = patients.filter((patient) => patient.username.toLowerCase().includes(query)
      || patient.email.toLowerCase().includes(query));
    setFilteredPatients(filtered);
  };

  useEffect(() => {
    if (user) {
      fetchPatients();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Log the filteredPatients whenever it changes
  useEffect(() => {
    console.warn('Updated filteredPatients:', filteredPatients);
  }, [filteredPatients]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <h1>Assigned Patients</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search patients..."
        value={searchQuery}
        onChange={handleSearchInputChange}
        style={{ marginBottom: '20px', padding: '10px', width: '100%' }}
      />

      {/* Display a message if no filtered patients are found */}
      {filteredPatients.length === 0 && searchQuery && (
        <p>No patients found matching {searchQuery}</p>
      )}

      {/* Patients Table */}
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
          {filteredPatients.map((patient) => (
            <tr key={patient.id}>
              <td>
                <img
                  src={patient.image_url}
                  alt="Patient Profile"
                  style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                />
              </td>
              <td>{patient.username}</td>
              <td>{patient.email}</td>
              <td>
                <button
                  className="btn btn-primary"
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
  );
}
