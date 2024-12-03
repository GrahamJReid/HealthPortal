/* eslint-disable no-trailing-spaces */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import PropTypes from 'prop-types';
import Link from 'next/link';

import { useAuth } from '../../utils/userContext';

import { getSingleUser } from '../../API/userData';
import SignOut from '../SignOut';

function OffCanvas({ name, ...props }) {
  const [show, setShow] = useState(false);
  const [singleUser, setSingleUser] = useState({});
  const { user } = useAuth();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    getSingleUser(user.id).then(setSingleUser);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <>
        
      <img src="/TimeCatcherLogo.png" className="navBarLogo" onClick={handleShow} />
     
      <Offcanvas show={show} onHide={handleClose} {...props} className="off-canvas-container">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="OffCanvas-title"> <img src={singleUser.image_url} width="200px" className="OffCanvas-user-image" /> </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="off-canvas-body">

          {/* <img src={singleUser.image_url} width="200px" className="OffCanvas-user-image" />  */}
          <h1 className="OffCanvas-username">{user.username}</h1>

          <nav onClick={handleClose}>
            <ul className="navbar-nav me-auto">
              <div className="NavLinkList">
                <li className="NavLink" id="NavLink1">
                  <Link passHref href="/">
                    <a className="NavLink">
                      Home
                    </a>
                  </Link>
                </li>

                <li className="NavLink" id="NavLink2">
                  <Link passHref href="/User/UserProfilePage">
                    <a className="NavLink">
                      Profile
                    </a>
                  </Link>
                </li>
                <li className="NavLink" id="NavLink3">
                  <Link passHref href="/Forms/FormsHomePage">
                    <a className="NavLink">
                      Forms
                    </a>
                  </Link>
                </li>
                <li className="NavLink" id="NavLink4">
                  <Link passHref href="/Medications/MedicationsHomePage">
                    <a className="NavLink">
                      Medications
                    </a>
                  </Link>
                </li>
                <li className="NavLink" id="NavLink5">
                  <Link passHref href="/VisitNotes/VisitNotesHomePage/">
                    <a className="NavLink">
                      Visit Notes
                    </a>
                  </Link>
                </li>
                <li className="NavLink" id="NavLink6">
                  <Link passHref href="/Chat/ChatHomePage">
                    <a className="NavLink">
                      Chat
                    </a>
                  </Link>
                </li>
               
              </div>
              <SignOut />
            </ul>
          </nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default OffCanvas;

OffCanvas.propTypes = {

  name: PropTypes.string.isRequired,

};
