// src/components/Navbar.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getDocs, collection } from 'firebase/firestore';
import './Navbar.css'; // Linking the CSS file

const Navbar = () => {
  const [user] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const [canAddClub, setCanAddClub] = useState(false); // New state to track if user can add clubs
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          const clubsSnapshot = await getDocs(collection(db, 'Clubs'));
          const clubs = clubsSnapshot.docs.map((doc) => doc.data());

          // Check if the user is an admin in any club
          const adminForClub = clubs.some((club) => club.adminIds && club.adminIds.includes(user.uid));

          if (adminForClub) {
            setIsAdmin(true); // User is an admin, show the manage button
          } else {
            setIsAdmin(false); // User is not an admin
          }
        } catch (error) {
          console.error("Error checking admin status: ", error);
        }
      }
    };

    const checkAddClubPermission = () => {
      // Check if the user is in the list of allowed UIDs (hardcoded or Firestore-based)
      const allowedToAddClubs = ['kunTHEg6lWhW50YHyG7mS9x6yfK2']; // Replace this with the actual allowed UIDs
      if (user && allowedToAddClubs.includes(user.uid)) {
        setCanAddClub(true); // User can add clubs
      } else {
        setCanAddClub(false); // User can't add clubs
      }
    };

    checkAdminStatus();
    checkAddClubPermission();
  }, [user]);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="nav-button" onClick={() => navigate('/')}>Home</button>
      </div>
      <div className="navbar-center">
        {isAdmin && (
          <button className="nav-button" onClick={() => navigate('/manage-clubs')}>
            Manage Memberships for Clubs
          </button>
        )}
        {/* Add Club Button: only visible to specific users */}
        {canAddClub && (
          <button className="nav-button" onClick={() => navigate('/add-club')}>
            Add Club
          </button>
        )}
      </div>
      <div className="navbar-right">
        <button className="nav-button" onClick={() => navigate('/profile')}>Profile</button>
      </div>
    </nav>
  );
};

export default Navbar;
