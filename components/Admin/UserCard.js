/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable no-unused-vars */
/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useRouter } from 'next/router';
import { useAuth } from '../../utils/userContext';
// eslint-disable-next-line import/no-unresolved
import userCardStyle from '../../styles/cards/userCard.module.css';

const UserCard = ({
  id,
  username,
  email,
  image_url,
  uid,
  role,
  admin,
}) => {
  const { user } = useAuth();
  const router = useRouter();
  return (
    <>
      <div>
        <Card className={userCardStyle.Card}>
          <Card.Header className={userCardStyle.CardHeader}>{username}</Card.Header>
          <Card.Body>
            <img className={userCardStyle.CardImage} src={image_url} alt="profile picture" style={{ width: '200px' }} />
            <p className={userCardStyle.CardEmail}>email: {email}</p>
            <p>{role}</p>
            <Button
              className={userCardStyle.Button}
              onClick={() => {
                router.push(`/users/${id}`);
              }}
            >
              View Profile
            </Button>

          </Card.Body>
        </Card>
      </div>
    </>
  );
};

UserCard.propTypes = {
  id: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,
  image_url: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  uid: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  admin: PropTypes.bool.isRequired,
};

export default UserCard;
