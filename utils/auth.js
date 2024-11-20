import firebase from 'firebase/app';
import 'firebase/auth';
import { clientCredentials } from './client';

// Check if a user exists in the database
const checkUser = (uid) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/checkuser`, {
    method: 'POST',
    body: JSON.stringify({ uid }),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
    .then((resp) => resolve(resp.json()))
    .catch(reject);
});

// Register a new user in the database
const registerUser = (userInfo) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/register`, {
    method: 'POST',
    body: JSON.stringify(userInfo),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
    .then((resp) => resolve(resp.json()))
    .catch(reject);
});

// Sign in the user with Google
const signIn = () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  // Force the user to select an account each time
  provider.setCustomParameters({ prompt: 'select_account' });

  // Ensure persistence is set correctly during sign-in
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION) // Use SESSION to avoid auto sign-out
    .then(() => firebase.auth().signInWithPopup(provider))
    .catch((error) => {
      console.error('Error during sign-in:', error);
    });
};

// Sign out the current user
const signOut = () => {
  firebase.auth().signOut()
    .then(() => {
      console.warn('User signed out.');
    })
    .catch((error) => {
      console.error('Error signing out:', error);
    });
};

export {
  signIn,
  signOut,
  checkUser,
  registerUser,
};
