/* eslint-disable implicit-arrow-linebreak */
import { clientCredentials } from '../utils/client';

const getPatientAllergyForm = (patientId) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/patientallergyform/${patientId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => resolve(data))
    .catch((error) => reject(error));
});

const createPatientAllergyForm = (payload) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/patientallergyform`, {
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

const updatePatientAllergyForm = (payload) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/patientallergyform/${payload.patient}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then(resolve)
    .catch(reject);
});

// eslint-disable-next-line import/prefer-default-export
export { getPatientAllergyForm, createPatientAllergyForm, updatePatientAllergyForm };
