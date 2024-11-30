/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable import/no-extraneous-dependencies */

// App.js
import Link from 'next/link';
import { useAuth } from '../utils/userContext'; // Import the Auth context

const App = () => {
  const { user } = useAuth(); // Access the global user state from context

  return (
    <div className="initial-container">
      {/* Only show buttons if no user is logged in */}
      {!user && (
        <div className="initial-button-div">
          <Link passHref href="/SignUpPage">
            <button className="button">Sign Up</button>
          </Link>
          <Link passHref href="/LoginPage">
            <button className="button">Login</button>
          </Link>
        </div>
      )}
      {user && (<h1>Welcome {user.username}</h1>)}
    </div>
  );
};

export default App;
