/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { useRouter } from 'next/router';
import { useAuth } from '../utils/userContext'; // Import your Auth context
import UserPool from '../.UserPool';
import { getUserByEmail } from '../API/userData';

// Replace with your API utility file path

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useAuth(); // Get the setUser function from Auth context
  const router = useRouter();

  const handleLogin = async (event) => {
    event.preventDefault();

    const user = new CognitoUser({
      Username: email,
      Pool: UserPool,
    });

    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    user.authenticateUser(authDetails, {
      onSuccess: (session) => {
        console.warn('Login successful');

        // Fetch user attributes
        user.getUserAttributes(async (err, attributes) => {
          if (err) {
            console.error('Error fetching user attributes:', err);
            return;
          }

          // Extract the email attribute
          const emailAttribute = attributes.find((attr) => attr.getName() === 'email').getValue();

          try {
            // Fetch the user from Django
            const userData = await getUserByEmail(emailAttribute);
            console.warn(userData);

            // Set the global user context
            setUser(userData);

            // Store email and user data in sessionStorage
            sessionStorage.setItem('userEmail', emailAttribute);
            sessionStorage.setItem('user', JSON.stringify(userData));

            // Navigate to the User Home Page
            console.warn('Navigating to /User/UserHomePage');
            router.push('/User/UserHomePage');
          } catch (fetchError) {
            console.error('Error fetching user from Django:', fetchError);
          }
        });
      },
      onFailure: (err) => {
        console.error('Login error:', err);
        if (err.code === 'NotAuthorizedException') {
          window.alert('Incorrect username or password. Please try again.');
        }
      },
      newPasswordRequired: (data) => {
        console.warn('New password required:', data);
      },
    });
  };

  return (
    <div className="login-container">
      <input
        className="input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="button" type="button" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
};

export default Login;
