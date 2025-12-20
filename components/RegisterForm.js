/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/require-default-props */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Form } from 'react-bootstrap';
import Head from 'next/head';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import PropTypes from 'prop-types';
import UserPool from '../.UserPool';
import { registerUser } from '../utils/auth';
import awsCredentials from '../.awsCred';
import { useAuth } from '../utils/userContext';

const RegisterForm = ({ user }) => {
  const { setUser } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    image: null,
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        username: user.username,
        email: user.email,
        image_url: user.image_url,
        uid: user.uid,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData((prev) => ({ ...prev, image: file }));
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
      await s3.send(command);
      return `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
    } catch (error) {
      console.error('Error uploading image to S3:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1️⃣ Signup with AWS Cognito
    UserPool.signUp(formData.email, formData.password, [], null, async (err, data) => {
      if (err) {
        console.error('Error signing up:', err);
        if (err.code === 'UsernameExistsException') {
          return window.alert('Email already exists. Use a different email.');
        } if (err.code === 'InvalidPasswordException') {
          return window.alert('Password does not meet policy requirements.');
        }
        return window.alert(`Error: ${err.message}`);
      }

      // 2️⃣ Upload image to S3 if provided
      let imageUrl = formData.image_url || '';
      if (formData.image) {
        const uploadedUrl = await uploadImageToS3(formData.image);
        if (uploadedUrl) imageUrl = uploadedUrl;
      }

      // 3️⃣ Register the user in the backend
      try {
        const backendUser = await registerUser({
          username: formData.username,
          email: formData.email,
          image_url: imageUrl,
          uid: data.userSub, // Cognito UID
          role: 'patient',
          admin: false,
        });

        // backendUser should include the numeric `id` from your DB
        if (!backendUser || !backendUser.id) {
          throw new Error('Backend did not return user ID.');
        }

        // 4️⃣ Set user in context and sessionStorage
        setUser(backendUser);
        sessionStorage.setItem('user', JSON.stringify(backendUser));
        sessionStorage.setItem('userEmail', backendUser.email);

        window.alert('Signup successful!');
        router.push('/User/UserProfilePage');
      } catch (backendErr) {
        console.error('Error registering user in backend:', backendErr);
        window.alert('There was an error completing your registration. Try again.');
      }
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
          <Form.Control type="file" name="image" onChange={handleFileChange} />
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
