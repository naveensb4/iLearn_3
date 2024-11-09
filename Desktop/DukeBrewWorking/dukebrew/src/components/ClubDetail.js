import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import './ClubDetail.css'; // Add a separate CSS file for styling

const ClubDetail = () => {
  const { id } = useParams(); // The club ID is passed as a URL parameter
  const [club, setClub] = useState(null);
  const [members, setMembers] = useState([]);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [joinRequested, setJoinRequested] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    const fetchClubData = async () => {
      try {
        const clubRef = doc(db, 'Clubs', id);
        const clubSnap = await getDoc(clubRef);
        if (clubSnap.exists()) {
          const clubData = clubSnap.data();
          setClub(clubData);

          // Ensure members is always an array
          const memberIds = clubData.members || [];
          fetchMemberData(memberIds);

          // Check if user is a member or an admin
          if (memberIds.includes(user?.uid)) {
            setIsMember(true);
          }
          if (clubData.adminIds?.includes(user?.email)) {
            setIsAdmin(true);
          }
          if (clubData.joinRequests?.includes(user?.uid)) {
            setJoinRequested(true);
          }
        } else {
          console.error('No such club!');
        }
      } catch (error) {
        console.error('Error fetching club data:', error);
      }
    };

    const fetchMemberData = async (memberIds) => {
      if (Array.isArray(memberIds) && memberIds.length > 0) {
        const memberData = await Promise.all(
          memberIds.map(async (memberId) => {
            const memberRef = doc(db, 'Users', memberId);
            const memberSnap = await getDoc(memberRef);
            if (memberSnap.exists()) {
              return { id: memberId, ...memberSnap.data() };
            }
            return null;
          })
        );
        setMembers(memberData.filter((member) => member !== null));
      } else {
        setMembers([]);
      }
    };

    if (user) {
      fetchClubData();
    }
  }, [id, user]);

  const handleJoinRequest = async () => {
    if (club && user) {
      try {
        const clubRef = doc(db, 'Clubs', id);
        console.log('Attempting to send join request...');
        console.log('User UID:', user.uid);
        console.log('Club ID:', id);

        // Add the user to joinRequests array using arrayUnion, which ensures no duplicate UIDs are added
        await updateDoc(clubRef, {
          joinRequests: arrayUnion(user.uid)
        });

        console.log('Join request sent successfully.');

        // Update local state to reflect join request
        setJoinRequested(true);
        setFeedbackMessage('Request Sent!');
      } catch (error) {
        console.error('Error sending join request:', error);
        setFeedbackMessage('Failed to send request. Please try again.');
      }
    }
  };

  const renderInitials = (name) => {
    const nameParts = name.split(' ');
    const initials = nameParts.map(part => part.charAt(0)).join('').toUpperCase();
    return initials;
  };

  if (!club) {
    return <p>Loading club details...</p>;
  }

  return (
    <div className="club-detail-container">
      <img src={club.logo_url} alt={`${club.name} Logo`} className="club-logo" />
      <h2 className="club-name">{club.name}</h2>
      <p className="club-description">{club.description}</p>
      {club.website_link && (
        <a href={club.website_link} target="_blank" rel="noopener noreferrer" className="club-website-link">
          Visit Club Website
        </a>
      )}

      <h3 className="members-heading">Members</h3>
      <div className="member-list">
        {members.length > 0 ? (
          members.map((member) => (
            <div key={member.id} className="member-card" onClick={() => navigate(`/user-profile/${member.id}`)}>
              {member.profile_image ? (
                <img src={member.profile_image} alt={`${member.name}'s Profile`} className="member-image" />
              ) : (
                <div className="member-placeholder">{renderInitials(member.name)}</div> // Placeholder if no profile image
              )}
              <h4 className="member-name">{member.name}</h4>
            </div>
          ))
        ) : (
          <p>No members yet.</p>
        )}
      </div>

      {/* Request to Join Button */}
      {!isMember && !isAdmin && !joinRequested && (
        <button onClick={handleJoinRequest} className="join-button">
          Request to Join
        </button>
      )}

      {feedbackMessage && (
        <p className={`feedback-message ${joinRequested ? 'success' : 'error'}`}>
          {feedbackMessage}
        </p>
      )}
    </div>
  );
};

export default ClubDetail;
