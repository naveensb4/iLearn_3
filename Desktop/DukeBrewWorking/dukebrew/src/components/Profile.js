import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const [user] = useAuthState(auth);
  const [profileData, setProfileData] = useState({
    name: '',
    year: '',
    major: '',
    recent_internships: '',
    hobbies: '',
    linkedIn: '',
    calendlyLink: '',
    profile_image: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        const userRef = doc(db, 'Users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setProfileData(userSnap.data());
        } else {
          // Create a new document with default values if it doesn't exist
          await setDoc(userRef, {
            name: user.displayName || '',
            ...profileData,
          });
          setProfileData((prevData) => ({
            ...prevData,
            name: user.displayName || '',
          }));
        }
      }
    };

    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/'); // Redirect to login page after sign-out
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleProfileUpdate = async () => {
    if (user) {
      const userRef = doc(db, 'Users', user.uid);
      await updateDoc(userRef, profileData);
      setIsEditing(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      <div className="profile-info">
        {isEditing ? (
          <div className="profile-edit-form">
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleInputChange}
              placeholder="Name"
            />
            <input
              type="text"
              name="year"
              value={profileData.year}
              onChange={handleInputChange}
              placeholder="Year"
            />
            <input
              type="text"
              name="major"
              value={profileData.major}
              onChange={handleInputChange}
              placeholder="Major"
            />
            <input
              type="text"
              name="recent_internships"
              value={profileData.recent_internships}
              onChange={handleInputChange}
              placeholder="Recent Internships"
            />
            <input
              type="text"
              name="hobbies"
              value={profileData.hobbies}
              onChange={handleInputChange}
              placeholder="Hobbies"
            />
            <input
              type="text"
              name="linkedIn"
              value={profileData.linkedIn}
              onChange={handleInputChange}
              placeholder="LinkedIn URL"
            />
            <input
              type="text"
              name="calendlyLink"
              value={profileData.calendlyLink}
              onChange={handleInputChange}
              placeholder="Calendly/Google Calendar Link"
            />
            <button className="save-button" onClick={handleProfileUpdate}>
              Save
            </button>
            <button className="cancel-button" onClick={handleEditToggle}>
              Cancel
            </button>
          </div>
        ) : (
          <div className="profile-details">
            <p>
              <strong>Name:</strong> {profileData.name}
            </p>
            <p>
              <strong>Year:</strong> {profileData.year}
            </p>
            <p>
              <strong>Major:</strong> {profileData.major}
            </p>
            <p>
              <strong>Recent Internships:</strong> {profileData.recent_internships}
            </p>
            <p>
              <strong>Hobbies:</strong> {profileData.hobbies}
            </p>
            <p>
              <strong>LinkedIn:</strong>{' '}
              <a
                href={profileData.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="profile-link"
              >
                {profileData.linkedIn}
              </a>
            </p>
            <p>
              <strong>Calendly Link:</strong>{' '}
              <a
                href={profileData.calendlyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="profile-link"
              >
                {profileData.calendlyLink}
              </a>
            </p>
            <button className="edit-button" onClick={handleEditToggle}>
              Edit Profile
            </button>
          </div>
        )}
      </div>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Profile;
