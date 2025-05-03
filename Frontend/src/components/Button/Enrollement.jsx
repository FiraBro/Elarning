import React, { useState } from 'react';
import axios from 'axios';

const EnrollButton = ({ courseId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const enrollInCourse = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Assuming you store the JWT token in localStorage after login
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `/api/courses/${courseId}/enroll`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to enroll. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={enrollInCourse} disabled={loading}>
        {loading ? 'Enrolling...' : 'Enroll'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Enrollment successful!</p>}
    </div>
  );
};

export default EnrollButton;
