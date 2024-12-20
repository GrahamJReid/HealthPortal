import { clientCredentials } from '../utils/client';

const getSingleUser = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/users/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve((data)))
    .catch(reject);
});
const getOtherUsers = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const users = Object.values(data).filter((item) => item.id !== id);
      resolve(users);
    })
    .catch(reject);
});
const getUserByEmail = (email) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const users = Object.values(data).filter((item) => item.email === email);
      resolve(users);
    })
    .catch(reject);
});
const updateUser = (payload) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/users/${payload.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then(resolve)
    .catch(reject);
});
const getUsersWithSearch = (id, searchQuery) => {
  const queryParams = searchQuery ? `?search=${searchQuery}` : '';

  return fetch(`${clientCredentials.databaseURL}/users${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) =>
    // Filter out the current user and apply search query filter
      // eslint-disable-next-line implicit-arrow-linebreak
      Object.values(data)
        .filter((user) => user.id !== id) // Exclude the current user
        .filter(
          (user) => !searchQuery
              || user.username.toLowerCase().includes(searchQuery.toLowerCase())
              || user.role.toLowerCase().includes(searchQuery.toLowerCase()),
        ));
};

export {
  getSingleUser, getOtherUsers, updateUser, getUserByEmail, getUsersWithSearch,
};
