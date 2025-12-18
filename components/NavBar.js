/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/anchor-is-valid */

import Link from 'next/link';
import OffCanvas from './OffCanvas/OffCanvas';
import ADMINOffCanvas from './OffCanvas/ADMINOffCanvas';
import DoctorOffCanvas from './OffCanvas/DoctorOffCanvas';
import { useAuth } from '../utils/userContext';

export default function NavBar() {
  const { user } = useAuth();

  // Determine which OffCanvas to render
  let OffCanvasComponent = OffCanvas;

  if (user?.admin) {
    OffCanvasComponent = ADMINOffCanvas;
  } else if (user?.role === 'doctor') {
    OffCanvasComponent = DoctorOffCanvas;
  }

  return (
    <>
      <nav className="navbar navbar-expand-md">
        <div className="container-fluid">
          <Link passHref href="/">
            <h1 className="NavBar-Title">HealthPortal</h1>
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#mainOffcanvas"
            aria-controls="mainOffcanvas"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
        </div>
      </nav>

      {/* OffCanvas MUST live outside the navbar collapse */}
      <OffCanvasComponent id="mainOffcanvas" placement="end" name="Menu" />
    </>
  );
}
