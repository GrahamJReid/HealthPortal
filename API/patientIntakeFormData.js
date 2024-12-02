/* eslint-disable implicit-arrow-linebreak */
import { clientCredentials } from '../utils/client';

const getPatientIntakeForm = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/patientintakeform`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const patientIntakeForm = Object.values(data).filter((item) => item.patient.id === id);
      resolve(patientIntakeForm[0]);
    })
    .catch(reject);
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
