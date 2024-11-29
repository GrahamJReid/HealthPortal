/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/require-default-props */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Form } from 'react-bootstrap';
import Head from 'next/head';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import PropTypes from 'prop-types';
// eslint-disable-next-line no-unused-vars
import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
// Cognito User Pool
import { registerUser } from '../utils/auth';
import awsCredentials from '../.awsCred';
import UserPool from '../.UserPool';
import { useAuth } from '../utils/userContext'; // Import the Auth context

const RegisterForm = ({ user }) => {
  const { setUser } = useAuth();
  const router = useRouter(); // Access the setUser function from the context
  const [formData, setFormData] = useState({
    username: user ? user.username : '',
    email: user ? user.email : '',
    password: '',
    image: null,
    uid: user?.uid || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        image_url: user.image_url,
        uid: user.uid,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        image: file,
      }));
    }
  };

  const uploadImageToS3 = async (file) => {
    const s3 = new S3Client({
      region: awsCredentials.awsRegion,
      credentials: {
        accessKeyId: awsCredentials.awsAccessKeyId,
        secretAccessKey: awsCredentials.awsSecretAccessKey,
      },
    });

    const params = {
      Bucket: 'healthportalbucket',
      Key: `UserProfilePictures/${file.name}`,
      Body: file,
    };

    try {
      const command = new PutObjectCommand(params);
      // eslint-disable-next-line no-unused-vars
      const response = await s3.send(command);
      return `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
    } catch (error) {
      console.error('Error uploading image to S3:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Step 1: Signup with AWS Cognito
    UserPool.signUp(formData.email, formData.password, [], null, async (err, data) => {
      if (err) {
        console.error('Error signing up:', err);

        // Handle Cognito-specific errors
        if (err.code === 'UsernameExistsException') {
          window.alert('Email already exists. Please use a different email.');
        } else if (err.code === 'InvalidPasswordException') {
          if (err.message.includes('symbol')) {
            window.alert('Password must contain symbol characters.');
          } else if (err.message.includes('uppercase')) {
            window.alert('Password must contain uppercase characters.');
          } else if (err.message.includes('numeric')) {
            window.alert('Password must contain numeric characters.');
          } else {
            window.alert('Invalid password. Please check the password policy.');
          }
        } else {
          window.alert(`Error: ${err.message}`);
        }
        return;
      }

      console.warn('Cognito Signup successful:', data);

      // Step 2: Proceed with additional form handling
      let updatedImageUrl = formData.image_url;

      if (formData.image) {
        const awsImageUrl = await uploadImageToS3(formData.image);

        if (awsImageUrl) {
          updatedImageUrl = awsImageUrl;
        }
      }

      const userData = {
        username: formData.username,
        email: formData.email,
        image_url: updatedImageUrl,
        uid: data.userSub, // Cognito's unique user ID
        role: 'patient',
        admin: false,
      };

      // Register the user in your database
      await registerUser(userData);
      console.warn('User registered:', userData);

      // Step 3: Store user data in sessionStorage
      sessionStorage.setItem('user', JSON.stringify(userData)); // Save to sessionStorage
      sessionStorage.setItem('userEmail', formData.email); // Optionally store the email

      // Step 4: Set user in global state (context)
      setUser(userData);

      // Redirect or provide success feedback
      window.alert('Signup successful!');
      router.push('/User/UserHomePage');
    });
  };

  return (
    <>
      <Head>
        <title>Register</title>
      </Head>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            name="username"
            required
            value={formData.username}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Profile Image</Form.Label>
          <Form.Control
            type="file"
            name="image"
            onChange={handleFileChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>
    </>
  );
};

RegisterForm.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    uid: PropTypes.string,
    email: PropTypes.string,
    username: PropTypes.string,
    image_url: PropTypes.string,
  }),
};

export default RegisterForm;
