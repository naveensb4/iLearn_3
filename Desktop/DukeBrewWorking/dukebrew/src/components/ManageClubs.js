// src/components/ManageClubs.js

import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import ClubManagement from './ClubManagement'; // Importing child components
import './ManageClubs.css'; // CSS for the page

const ManageClubs = () => {
  const [user] = useAuthState(auth);
  const [adminClubs, setAdminClubs] = useState([]);
  const [clubDetails, setClubDetails] = useState({});

  useEffect(() => {
    const fetchAdminClubs = async () => {
      if (user) {
        try {
          const clubsSnapshot = await getDocs(collection(db, 'Clubs'));
          const clubs = clubsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Match admin by user ID (uid)
          const adminClubs = clubs.filter((club) =>
            club.adminIds && club.adminIds.includes(user.uid)
          );

          setAdminClubs(adminClubs);
          await fetchClubDetails(adminClubs);
        } catch (error) {
          console.error('Error fetching admin clubs:', error);
        }
      }
    };

    const fetchClubDetails = async (clubs) => {
      const details = {};
      for (let club of clubs) {
        const joinRequestsDetails = await Promise.all(
          club.joinRequests.map(async (userId) => {
            const userRef = doc(db, 'Users', userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              return { id: userId, ...userSnap.data() };
            }
            return { id: userId, name: 'Unknown User' }; // fallback if user data is missing
          })
        );

        const approvedMembersDetails = await Promise.all(
          club.members.map(async (userId) => {
            const userRef = doc(db, 'Users', userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              return { id: userId, ...userSnap.data() };
            }
            return { id: userId, name: 'Unknown User' }; // fallback if user data is missing
          })
        );

        const rejectedMembersDetails = await Promise.all(
          (club.rejectedMembers || []).map(async (userId) => {
            const userRef = doc(db, 'Users', userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              return { id: userId, ...userSnap.data() };
            }
            return { id: userId, name: 'Unknown User' }; // fallback if user data is missing
          })
        );

        details[club.id] = {
          ...club,
          joinRequestsDetails,
          approvedMembersDetails,
          rejectedMembersDetails,
        };
      }
      setClubDetails(details);
    };

    fetchAdminClubs();
  }, [user]);

  const handleApprove = async (clubId, userId) => {
    try {
      const clubRef = doc(db, 'Clubs', clubId);
      const clubSnap = await getDoc(clubRef);
      if (clubSnap.exists()) {
        const clubData = clubSnap.data();
        const updatedRequests = clubData.joinRequests.filter((id) => id !== userId);
        const updatedMembers = [...(clubData.members || []), userId];

        await updateDoc(clubRef, {
          joinRequests: updatedRequests,
          members: updatedMembers,
        });

        // Refresh state
        setClubDetails((prevDetails) => ({
          ...prevDetails,
          [clubId]: {
            ...prevDetails[clubId],
            joinRequestsDetails: prevDetails[clubId].joinRequestsDetails.filter((req) => req.id !== userId),
            approvedMembersDetails: [...prevDetails[clubId].approvedMembersDetails, { id: userId, name: prevDetails[clubId].joinRequestsDetails.find((req) => req.id === userId).name }],
          },
        }));
      }
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleReject = async (clubId, userId) => {
    try {
      const clubRef = doc(db, 'Clubs', clubId);
      const clubSnap = await getDoc(clubRef);
      if (clubSnap.exists()) {
        const clubData = clubSnap.data();
        const updatedRequests = clubData.joinRequests.filter((id) => id !== userId);
        const updatedRejectedMembers = [...(clubData.rejectedMembers || []), userId];

        await updateDoc(clubRef, {
          joinRequests: updatedRequests,
          rejectedMembers: updatedRejectedMembers,
        });

        // Refresh state
        setClubDetails((prevDetails) => ({
          ...prevDetails,
          [clubId]: {
            ...prevDetails[clubId],
            joinRequestsDetails: prevDetails[clubId].joinRequestsDetails.filter((req) => req.id !== userId),
            rejectedMembersDetails: [...(prevDetails[clubId].rejectedMembersDetails || []), { id: userId, name: prevDetails[clubId].joinRequestsDetails.find((req) => req.id === userId).name }],
          },
        }));
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  return (
    <div className="manage-clubs-container">
      <h2>Manage Club Memberships</h2>
      {adminClubs.length > 0 ? (
        adminClubs.map((club) => (
          <ClubManagement
            key={club.id}
            club={club}
            clubDetails={clubDetails[club.id]}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ))
      ) : (
        <p>You are not managing any clubs.</p>
      )}
    </div>
  );
};

export default ManageClubs;
