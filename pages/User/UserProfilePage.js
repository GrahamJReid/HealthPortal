/* eslint-disable react/button-has-type */
import React from 'react';
import { useAuth } from '../../utils/userContext';

export default function UserHomePage() {
  const { user } = useAuth(); // Destructure the user object from the context
  console.warn('Logged-in user:', user);

  // Guard against `user` being null or undefined
  if (!user) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>User Profile Page</h1>
      <h2>Welcome, {user.username}!</h2>
    </div>
  );
}
