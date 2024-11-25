/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-vars */
// App.js

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Login from '../components/Login';

const LoginPage = () => (
  <div className="login-page-container">
    <h1 className="title">Login</h1>
    <Login />
  </div>
);

export default LoginPage;
