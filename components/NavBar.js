/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/anchor-is-valid */
import Link from 'next/link';
import OffCanvas from './OffCanvas/OffCanvas';
import ADMINOffCanvas from './OffCanvas/ADMINOffCanvas';
// import DoctorOffCanvas from './DoctorOffCanvas';
import { useAuth } from '../utils/userContext';
import DoctorOffCanvas from './OffCanvas/DoctorOffCanvas';
// Import your useAuth hook

export default function NavBar() {
  const { user } = useAuth(); // Get the current user from useAuth

  // Determine which OffCanvas to render
  let OffCanvasComponent = OffCanvas; // Default OffCanvas

  if (user?.admin) {
    OffCanvasComponent = ADMINOffCanvas; // Show AdminOffCanvas if the user is an admin
  } else if (user?.role === 'doctor') {
    OffCanvasComponent = DoctorOffCanvas; // Show DoctorOffCanvas if the user's role is "doctor"
  } else if (user?.role === 'patient' && user?.admin === false) {
    OffCanvasComponent = OffCanvas; // Show OffCanvas if the user's role is "patient"
  }

  return (
    <nav className="navbar navbar-expand-md">
      <div className="container-fluid">
        <Link passHref href="/">
          <h1 className="NavBar-Title">HealthPortal</h1>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo01"
          aria-controls="navbarTogglerDemo01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <img src="/TimeCatcherLogo.png" width="200px" />
        </button>

        <div>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <ul className="navbar-nav me-auto">
              <li className="off-canvas-on-navbar">
                {/* Render the appropriate OffCanvas component */}
                <OffCanvasComponent placement="end" name="Menu" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
