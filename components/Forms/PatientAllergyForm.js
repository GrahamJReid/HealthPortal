/* eslint-disable no-unused-vars */
/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useAuth } from '../../utils/userContext';
import { createPatientAllergyForm, updatePatientAllergyForm } from '../../API/patientallergyFormData';
import Loading from '../Loading';

function PatientAllergyForm({ obj }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    pollen: obj ? obj.pollen : false,
    pet: obj ? obj.pet : false,
    mold: obj ? obj.mold : false,
    milk: obj ? obj.milk : false,
    eggs: obj ? obj.eggs : false,
    nuts: obj ? obj.nuts : false,
    shellfish: obj ? obj.shellfish : false,
    insect: obj ? obj.insect : false,
    medications: obj ? obj.medications : false,
    latex: obj ? obj.latex : false,
    other: obj ? obj.other : '',
  });

  // Sync formData if editing
  useEffect(() => {
    if (obj) {
      setFormData({
        pollen: obj.pollen,
        pet: obj.pet,
        mold: obj.mold,
        milk: obj.milk,
        eggs: obj.eggs,
        nuts: obj.nuts,
        shellfish: obj.shellfish,
        insect: obj.insect,
        medications: obj.medications,
        latex: obj.latex,
        other: obj.other,
      });
    }
  }, [obj]);

  // Handle form changes
  const handleInputChange = (e) => {
    const {
      name, type, checked, value,
    } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      window.alert('User is not loaded yet. Please wait.');
      return;
    }

    setLoading(true);

    const allergyData = {
      ...formData,
      patient: user.id,
    };

    try {
      if (obj) {
        allergyData.id = obj.id;
        await updatePatientAllergyForm(allergyData);
      } else {
        await createPatientAllergyForm(allergyData);
      }
      window.alert('Changes complete');
      window.location.reload();
    } catch (error) {
      console.error('Error saving patient allergy form:', error);
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
      {['pollen', 'pet', 'mold', 'milk', 'eggs', 'nuts', 'shellfish', 'insect', 'medications', 'latex'].map((field) => (
        <Form.Group className="mb-3" key={field}>
          <Form.Check
            type="checkbox"
            label={field.charAt(0).toUpperCase() + field.slice(1)}
            name={field}
            checked={formData[field]}
            onChange={handleInputChange}
          />
        </Form.Group>
      ))}

      <Form.Group className="mb-3">
        <Form.Label>Other Allergies</Form.Label>
        <Form.Control
          name="other"
          value={formData.other}
          onChange={handleInputChange}
        />
      </Form.Group>

      {loading ? (
        <Loading />
      ) : (
        <Button variant="primary" type="submit">
          {obj ? 'Update Allergy Form' : 'Create Allergy Form'}
        </Button>
      )}
    </Form>
  );
}

PatientAllergyForm.propTypes = {
  obj: PropTypes.shape({
    id: PropTypes.number,
    pollen: PropTypes.bool,
    pet: PropTypes.bool,
    mold: PropTypes.bool,
    milk: PropTypes.bool,
    eggs: PropTypes.bool,
    nuts: PropTypes.bool,
    shellfish: PropTypes.bool,
    insect: PropTypes.bool,
    medications: PropTypes.bool,
    latex: PropTypes.bool,
    other: PropTypes.string,
  }),
};

export default PatientAllergyForm;
