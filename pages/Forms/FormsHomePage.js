import React, { useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { useAuth } from '../../utils/userContext';
import PatientIntakeForm from '../../components/Forms/PatientIntakeForm';
import { getPatientIntakeForm } from '../../API/patientIntakeFormData';
import PatientAllergyForm from '../../components/Forms/PatientAllergyForm';
import { getPatientAllergyForm } from '../../API/patientallergyFormData';

export default function FormsHomePage() {
  const { user } = useAuth();
  const [existingIntakeForm, setExistingIntakeForm] = useState(null);
  const [existingAllergyForm, setExistingAllergyForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      // Fetch intake form
      getPatientIntakeForm(user.id)
        .then((form) => setExistingIntakeForm(form || null))
        .catch((err) => console.error('Error fetching intake form:', err));

      // Fetch allergy form
      getPatientAllergyForm(user.id)
        .then((form) => setExistingAllergyForm(form || null))
        .catch((err) => console.error('Error fetching allergy form:', err))
        .finally(() => setLoading(false));
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
      <Tabs defaultActiveKey="intakeform" id="forms-tabs">
        <Tab eventKey="intakeform" title="Intake Form">
          <div>
            <PatientIntakeForm obj={existingIntakeForm} />
          </div>
        </Tab>
        <Tab eventKey="allergiesform" title="Allergies Form">
          <div>
            <PatientAllergyForm obj={existingAllergyForm} />
          </div>
        </Tab>
        <Tab eventKey="threads" title="Threads">
          <div>Threads</div>
        </Tab>
      </Tabs>
    </div>
  );
}
