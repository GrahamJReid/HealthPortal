/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable import/no-extraneous-dependencies */
// App.js

import Link from 'next/link';

const App = () => (
  <div className="initial-container">
    <div className="initial-button-div">
      <Link passHref href="/SignUpPage">
        <button className="button">Sign Up</button>
      </Link>
      <Link passHref href="/LoginPage">
        <button className="button">Login</button>
      </Link>
    </div>
  </div>
);

export default App;
