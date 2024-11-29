/* eslint-disable react/button-has-type */
import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../utils/userContext';

function SignOut() {
  const { setUser } = useAuth(); // Access the setUser function from the context
  const router = useRouter();

  const handleSignOut = () => {
    // Clear the user data from sessionStorage
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('userEmail');

    // Set global user to null
    setUser(null);

    // Redirect to the login page or home page
    router.push('/');
  };

  return (
    <button onClick={handleSignOut} className="sign-out-button">
      Sign Out
    </button>
  );
}

export default SignOut;
