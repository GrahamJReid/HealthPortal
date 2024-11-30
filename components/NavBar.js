/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/anchor-is-valid */
import Link from 'next/link';
import OffCanvas from './OffCanvas';

export default function NavBar() {
  return (
    <nav className="navbar navbar-expand-md">
      <div className="container-fluid">
        <Link passHref href="/">
          <h1 className="NavBar-Title">HealthPortal</h1>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
          <img src="/TimeCatcherLogo.png" width="200px" />
        </button>

        <div>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <ul className="navbar-nav me-auto">
              <li className="off-canvas-on-navbar">
                <OffCanvas placement="end" name="Menu" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
