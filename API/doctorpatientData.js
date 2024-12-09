/* eslint-disable implicit-arrow-linebreak */
import { clientCredentials } from '../utils/client';

const createDoctorPatient = (payload) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/doctorpatient`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

const deleteDoctorPatient = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/doctorpatient/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((data) => resolve((data)))
    .catch(reject);
});
const getDoctorPatientByDoctorId = (doctorId) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/get_doctor_patient_by_doctor_id/${doctorId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch doctor-patient assignments');
      }
      return response.json();
    })
    .then((data) => {
      // Map patient IDs to assignment IDs for easier lookup
      const assignmentsMap = data.reduce((acc, item) => {
        acc[item.patient.id] = item.id; // Map patient ID to assignment ID
        return acc;
      }, {});
      resolve(assignmentsMap);
    })
    .catch(reject);
});

// eslint-disable-next-line import/prefer-default-export
export { createDoctorPatient, deleteDoctorPatient, getDoctorPatientByDoctorId };
