import React, { useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { useAuth } from '../../utils/userContext';
import PatientIntakeForm from '../../components/Forms/PatientIntakeForm';
import { getPatientIntakeForm } from '../../API/patientIntakeFormData';

export default function FormsHomePage() {
  const { user } = useAuth();
  const [existingForm, setExistingForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Fetch the existing form for the logged-in user
      getPatientIntakeForm(user.id)
        .then((form) => {
          setExistingForm(form); // Save the form data if it exists
        })
        .catch((error) => {
          console.error('Error fetching patient intake form:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user]);

  if (!user || loading) {
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
        <Tabs defaultActiveKey="timelines" id="uncontrolled-tab-example">
          <Tab eventKey="intakeform" title="Intake Form">
            <div>
              {/* Pass the existing form data to the PatientIntakeForm */}
              <PatientIntakeForm obj={existingForm} />
            </div>
          </Tab>
          <Tab eventKey="allergiesform" title="Allergies Form">
            <div>Allergies form</div>
          </Tab>
          <Tab eventKey="threads" title="Threads">
            <div>Threads</div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
