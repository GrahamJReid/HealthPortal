import PropTypes from 'prop-types';
import { useAuth } from './context/authContext';
import NavBar from '../components/NavBar';

const ViewDirectorBasedOnUserAuthStatus = ({ component: Component, pageProps }) => {
  // eslint-disable-next-line no-unused-vars
  const { user, userLoading } = useAuth();

  // Show loading screen while user authentication state is being determined

  // If the user is authenticated, render the NavBar and the current page component
  return (
    <>
      <NavBar /> {/* Always show the NavBar */}
      <main style={{ marginTop: '4rem' }}> {/* Add spacing to account for the fixed NavBar */}
        <Component {...pageProps} /> {/* Dynamically render the current page */}
      </main>
    </>
  );
};

export default ViewDirectorBasedOnUserAuthStatus;

ViewDirectorBasedOnUserAuthStatus.propTypes = {
  component: PropTypes.func.isRequired,
  pageProps: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
