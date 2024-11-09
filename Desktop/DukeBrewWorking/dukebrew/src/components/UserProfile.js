import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import './UserProfile.css'; // Updated CSS file

const UserProfile = () => {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userRef = doc(db, 'Users', id);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setProfileData(userSnap.data());
        } else {
          console.error('No such user!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchProfileData();
  }, [id]);

  if (!profileData) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="user-profile-container">
      {profileData.profile_image ? (
        <img
          src={profileData.profile_image}
          alt="Profile"
          className="profile-image"
        />
      ) : (
        <div className="profile-placeholder">
          {profileData.name
            ? profileData.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
            : 'NA'}
        </div>
      )}
      <h2 className="profile-name">{profileData.name}</h2>
      <div className="profile-details">
        <p>
          <strong>Year: </strong>
          {profileData.year || 'Not provided'}
        </p>
        <p>
          <strong>Major: </strong>
          {profileData.major || 'Not provided'}
        </p>
        <p>
          <strong>Recent Internships: </strong>
          {profileData.recent_internships || 'Not provided'}
        </p>
        <p>
          <strong>LinkedIn: </strong>
          {profileData.linkedIn ? (
            <a
              href={profileData.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="profile-link"
            >
              {profileData.linkedIn}
            </a>
          ) : (
            'Not provided'
          )}
        </p>
        <p>
          <strong>Hobbies: </strong>
          {profileData.hobbies || 'No hobbies specified.'}
        </p>
        <p>
          <strong>Description: </strong>
          {profileData.description || 'No description provided.'}
        </p>
      </div>

      {/* Book Coffee Chat Button */}
      {profileData.calendlyLink && (
        <button
          onClick={() => window.open(profileData.calendlyLink, '_blank')}
          className="coffee-chat-button"
        >
          Let's Grab Coffee
        </button>
      )}
    </div>
  );
};

export default UserProfile;
