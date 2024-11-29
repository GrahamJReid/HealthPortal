/* eslint-disable react/prop-types */
import React from 'react';
import { useAuth } from './userContext';
// Adjust path based on your file structure

function SetUser({ userObject }) {
  const { setUser } = useAuth(); // Access the `setUser` function from context

  // Set the user when this component renders
  React.useEffect(() => {
    if (userObject) {
      setUser(userObject);
    }
  }, [userObject, setUser]);

  return (
    <div>
      <h1>User Set Successfully!</h1>
    </div>
  );
}

export default SetUser;
