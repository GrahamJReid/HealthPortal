/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { useRouter } from 'next/router';
import UserPool from '../.UserPool';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userAttributes, setUserAttributes] = useState(null);
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

        // Fetch user attributes after successful authentication
        user.getUserAttributes((err, attributes) => {
          if (err) {
            console.error('Error fetching user attributes:', err);
          } else {
            const userData = {};
            attributes.forEach((attribute) => {
              userData[attribute.getName()] = attribute.getValue();
            });
            setUserAttributes(userData);

            const username = email; // Extract username from email
            // router.push(`/landing/${username}`);
            router.push('/User/UserHomePage');
          }
        });
      },
      onFailure: (err) => {
        console.error('Login error:', err);
        if (err.code === 'NotAuthorizedException') {
          // Display alert for incorrect username or password
          window.alert('Incorrect username or password. Please try again.');
        }
      },
      newPasswordRequired: (data) => {
        console.warn('New password required:', data);
      },
    });
  };

  console.warn('These are the user attributes:', userAttributes);

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
