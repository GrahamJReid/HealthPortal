import PropTypes from 'prop-types';
import { useAuth } from './userContext'; // Import the Auth context
import NavBar from '../components/NavBar';

// Component to render the NavBar and the current page component
const ViewDirectorBasedOnUserAuthStatus = ({ component: Component, pageProps }) => {
  // eslint-disable-next-line no-unused-vars
  const { user } = useAuth(); // Access global user state from context

  // Always render the NavBar and the current page component
  return (
    <>
      {user && <NavBar />}
      <main style={{ marginTop: '4rem' }}> {/* Add spacing to account for the fixed NavBar */}
        <Component {...pageProps} /> {/* Dynamically render the current page */}
      </main>
    </>
  );
};

ViewDirectorBasedOnUserAuthStatus.propTypes = {
  component: PropTypes.func.isRequired,
  pageProps: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default ViewDirectorBasedOnUserAuthStatus;
