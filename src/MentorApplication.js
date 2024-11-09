import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

const MentorApplication = () => {
  const [formData, setFormData] = useState({
    name: '',
    reason: '',
    topic: '',
    languages: '',
    linkedIn: '',
  });
  const [applicationStatus, setApplicationStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicationStatus = async () => {
      if (auth.currentUser) {
        try {
          const q = query(
            collection(db, 'mentorApplications'),
            where('userId', '==', auth.currentUser.uid)
          );
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const appData = querySnapshot.docs[0].data();
            setApplicationStatus(appData.status || 'No status available');
          } else {
            setApplicationStatus('No application found.');
          }
        } catch (error) {
          console.error('Error fetching application status:', error);
        }
      }
      setLoading(false);
    };

    fetchApplicationStatus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      alert('You need to be logged in to submit an application.');
      return;
    }

    if (!formData.name || !formData.reason || !formData.topic || !formData.languages || !formData.linkedIn) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      await addDoc(collection(db, 'mentorApplications'), {
        ...formData,
        userId: auth.currentUser.uid,
        status: 'pending',
        createdAt: new Date(),
      });
      alert('Application submitted successfully!');
      setFormData({
        name: '',
        reason: '',
        topic: '',
        languages: '',
        linkedIn: '',
      });
      setApplicationStatus('pending');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading application status...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>Mentor Application</h2>
      {applicationStatus && applicationStatus !== 'No application found.' ? (
        <p>Your application is currently {applicationStatus}.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{ padding: '10px', width: '100%' }}
              required
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Why are you interested in applying to be a mentor?</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              style={{ padding: '10px', width: '100%' }}
              required
            ></textarea>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>What are you going to teach?</label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              style={{ padding: '10px', width: '100%' }}
              required
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>LinkedIn Profile URL:</label>
            <input
              type="url"
              name="linkedIn"
              value={formData.linkedIn}
              onChange={handleChange}
              style={{ padding: '10px', width: '100%' }}
              required
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Languages you can teach in:</label>
            <input
              type="text"
              name="languages"
              value={formData.languages}
              onChange={handleChange}
              style={{ padding: '10px', width: '100%' }}
              required
            />
          </div>
          <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
            Submit Application
          </button>
        </form>
      )}
    </div>
  );
};

export default MentorApplication;
