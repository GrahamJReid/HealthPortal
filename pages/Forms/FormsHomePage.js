/* eslint-disable react/button-has-type */
import React from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { useAuth } from '../../utils/userContext';

export default function FormsHomePage() {
  const { user } = useAuth(); // Destructure the user object from the context
  console.warn('Logged-in user:', user);

  // Guard against `user` being null or undefined
  if (!user) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Forms Home Page</h1>
      <h2>Welcome, {user.username}!</h2>
      <div>
        <Tabs
          defaultActiveKey="timelines"
          id="uncontrolled-tab-example"
        >
          <Tab eventKey="intakeform" title="Intake Form">
            <div>Patient Intake form</div>

          </Tab>
          <Tab eventKey="allergiesform" title="Allergies Form">
            <div>allergies form</div>
          </Tab>
          <Tab eventKey="threads" title="Threads">
            <div>Threads</div>

          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
