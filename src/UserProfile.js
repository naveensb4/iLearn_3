import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { doc, getDoc, updateDoc, setDoc, collection, getDocs, query, where } from 'firebase/firestore';
import './UserProfile.css'; // Importing CSS for styling

const UserProfile = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    photoURL: '',
    linkedIn: '',
    description: '',
    hobbies: '',
    role: 'user',
  });
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            const initialData = {
              name: auth.currentUser.displayName || '',
              email: auth.currentUser.email || '',
              photoURL: auth.currentUser.photoURL || '',
              linkedIn: '',
              description: '',
              hobbies: '',
              role: 'user',
            };
            await setDoc(userDocRef, initialData);
            setUserData(initialData);
          }

          const q = query(
            collection(db, 'mentorApplications'),
            where('userId', '==', auth.currentUser.uid)
          );
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const appData = querySnapshot.docs[0].data();
            setApplicationStatus(appData.status);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setError('Failed to fetch user data. Please try again.');
        }
        setIsLoading(false);
      } else {
        setError('User not authenticated. Please sign in.');
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSaveChanges = async () => {
    if (auth.currentUser) {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      try {
        await updateDoc(userDocRef, { ...userData, role: userData.role });
        alert('Profile updated successfully!');
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating profile:', error);
        setError('Failed to update profile. Please try again.');
      }
    } else {
      setError('User not authenticated. Cannot update profile.');
    }
  };

  if (isLoading) {
    return <div className="loading-container">Loading user profile...</div>;
  }

  return (
    <div className="user-profile-container">
      <h2 className="profile-title">User Profile</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="profile-field">
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={userData.name}
          onChange={handleInputChange}
          disabled={!isEditing}
          className={`profile-input ${isEditing ? 'editable' : ''}`}
          required
        />
      </div>
      <div className="profile-field">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={userData.email}
          disabled
          className="profile-input"
        />
      </div>
      <div className="profile-field">
        <label>Role:</label>
        <input
          type="text"
          name="role"
          value={userData.role}
          disabled
          className="profile-input"
        />
      </div>
      {applicationStatus && (
        <div className={`application-status ${applicationStatus === 'rejected' ? 'rejected' : 'approved'}`}>
          <p>Your mentor application status: <strong>{applicationStatus}</strong></p>
          {applicationStatus === 'rejected' && (
            <p>
              We're sorry, your application was rejected. Please feel free to apply again or contact support for more details.
            </p>
          )}
        </div>
      )}
      {isEditing ? (
        <div className="button-group">
          <button onClick={handleSaveChanges} className="save-button">
            Save Changes
          </button>
          <button onClick={() => setIsEditing(false)} className="cancel-button">
            Cancel
          </button>
        </div>
      ) : (
        <button onClick={() => setIsEditing(true)} className="edit-button">
          Edit Profile
        </button>
      )}
    </div>
  );
};

export default UserProfile;
