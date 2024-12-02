/* eslint-disable no-unused-vars */
/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useAuth } from '../../utils/userContext';
import { createPatientIntakeForm, updatePatientIntakeForm } from '../../API/patientIntakeFormData';
import Loading from '../Loading';

function PatientIntakeForm({ obj }) {
  const { user } = useAuth(); // Get user info from the context
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: obj ? obj.name : '',
    date: obj ? obj.date : '',
    email: obj ? obj.email : '',
    address: obj ? obj.address : '',
    city: obj ? obj.city : '',
    state: obj ? obj.state : '',
    zip: obj ? obj.zip : '',
    phonenumber: obj ? obj.phonenumber : '',
    sex: obj ? obj.sex : '',
    birthdate: obj ? obj.birthdate : '',
    socialsecurity: obj ? obj.socialsecurity : '',
    emergencycontactname: obj ? obj.emergencycontactname : '',
    emergencycontactphone: obj ? obj.emergencycontactphone : '',
  });

  // Sync formData if editing
  useEffect(() => {
    if (obj) {
      setFormData({
        name: obj.name,
        date: obj.date,
        email: obj.email,
        address: obj.address,
        city: obj.city,
        state: obj.state,
        zip: obj.zip,
        phonenumber: obj.phonenumber,
        sex: obj.sex,
        birthdate: obj.birthdate,
        socialsecurity: obj.socialsecurity,
        emergencycontactname: obj.emergencycontactname,
        emergencycontactphone: obj.emergencycontactphone,
      });
    }
  }, [obj]);

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const patientIntakeData = {
      ...formData,
      patient: user.id, // Assign the current logged-in user's ID
    };

    try {
      if (obj) {
        // If editing, include the form's ID
        patientIntakeData.id = obj.id;
        await updatePatientIntakeForm(patientIntakeData);
      } else {
        await createPatientIntakeForm(patientIntakeData);
      }
      window.location.reload(true); // Refresh page after submission
    } catch (error) {
      console.error('Error saving patient intake form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      style={{
        height: '90vh',
        padding: '30px',
        maxWidth: '500px',
        margin: '0 auto',
      }}
    >
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          name="name"
          required
          value={formData.name}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Date</Form.Label>
        <Form.Control
          name="date"
          type="date"
          required
          value={formData.date}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Address</Form.Label>
        <Form.Control
          name="address"
          required
          value={formData.address}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>City</Form.Label>
        <Form.Control
          name="city"
          required
          value={formData.city}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>State</Form.Label>
        <Form.Control
          name="state"
          required
          value={formData.state}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Zip</Form.Label>
        <Form.Control
          name="zip"
          required
          value={formData.zip}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Phone Number</Form.Label>
        <Form.Control
          name="phonenumber"
          required
          value={formData.phonenumber}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Sex</Form.Label>
        <Form.Control
          name="sex"
          required
          value={formData.sex}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Birth Date</Form.Label>
        <Form.Control
          name="birthdate"
          type="date"
          required
          value={formData.birthdate}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Social Security</Form.Label>
        <Form.Control
          name="socialsecurity"
          required
          value={formData.socialsecurity}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Emergency Contact Name</Form.Label>
        <Form.Control
          name="emergencycontactname"
          required
          value={formData.emergencycontactname}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Emergency Contact Phone</Form.Label>
        <Form.Control
          name="emergencycontactphone"
          required
          value={formData.emergencycontactphone}
          onChange={handleInputChange}
        />
      </Form.Group>

      {loading ? (
        <Loading />
      ) : (
        <Button variant="primary" type="submit">
          {obj ? 'Update Patient Intake Form' : 'Create Patient Intake Form'}
        </Button>
      )}
    </Form>
  );
}

PatientIntakeForm.propTypes = {
  obj: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    date: PropTypes.string,
    email: PropTypes.string,
    address: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    zip: PropTypes.string,
    phonenumber: PropTypes.string,
    sex: PropTypes.string,
    birthdate: PropTypes.string,
    socialsecurity: PropTypes.string,
    emergencycontactname: PropTypes.string,
    emergencycontactphone: PropTypes.string,
  }),
};

export default PatientIntakeForm;
