/* eslint-disable react/require-default-props */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import Head from 'next/head';
// eslint-disable-next-line import/no-extraneous-dependencies
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import PropTypes from 'prop-types';
import { registerUser } from '../utils/auth';
import { clientCredentials } from '../utils/client';
import awsCredentials from '../.awsCred';

const RegisterForm = ({ user }) => {
  const [formData, setFormData] = useState({
    username: user ? user.username : '',
    email: user ? user.email : '',
    image: null, // Change from '' to null
    uid: user.uid,
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
      region: awsCredentials.awsRegion, // Replace with your AWS region
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
      const response = await s3.send(command);
      return `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
    } catch (error) {
      console.error('Error uploading image to S3:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      uid: user.uid,
      role: 'patient',
      admin: false,
    };

    if (user.username) {
      userData.id = user.id;
      // eslint-disable-next-line no-undef
      await updateUser(userData);
    } else {
      await registerUser(userData);
    }
    console.warn(userData);
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
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Profile Image</Form.Label>
          <Form.Control
            type="file"
            name="image"
            {...user ? {} : { required: true }}
            onChange={handleFileChange}
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
        >
          {user.username ? 'Update' : 'Register'}
        </Button>
      </Form>
    </>
  );
};

RegisterForm.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    uid: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    image_url: PropTypes.string,

  }),
};

export default RegisterForm;
