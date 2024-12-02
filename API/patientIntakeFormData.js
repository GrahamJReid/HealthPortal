/* eslint-disable implicit-arrow-linebreak */
import { clientCredentials } from '../utils/client';

const getPatientIntakeForm = (patientId) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/api/getpatientintakeform/${patientId}/`, {
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

const createPatientIntakeForm = (payload) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/patientintakeform`, {
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

const updatePatientIntakeForm = (payload) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/patientintakeform/${payload.id}`, {
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
export { getPatientIntakeForm, createPatientIntakeForm, updatePatientIntakeForm };
