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

  let OffCanvasComponent = OffCanvas;
  if (user?.admin) {
    OffCanvasComponent = ADMINOffCanvas;
  } else if (user?.role === 'doctor') {
    OffCanvasComponent = DoctorOffCanvas;
  }

  return (
    <>
      <div className="nav-bar-div">
        <Link href="/" passHref>
          <h1 className="NavBar-Title">HealthPortal</h1>
        </Link>
        {/* OffCanvas lives outside navbar */}
        <OffCanvasComponent id="mainOffcanvas" placement="end" name="Menu" />
      </div>
    </>
  );
}
