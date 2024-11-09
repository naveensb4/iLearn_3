// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { auth } from './firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import Login from './components/Login';
import Home from './components/Home';
import Profile from './components/Profile';
import ManageClubs from './components/ManageClubs';
import AddClub from './components/AddClub';  // Import AddClub component
import ClubDetail from './components/ClubDetail';
import UserProfile from './components/UserProfile';
import CalendlyOnboarding from './components/CalendlyOnboarding';
import Navbar from './components/Navbar';

function App() {
  const [user] = useAuthState(auth);
  const allowedToAddClubs = ['kunTHEg6lWhW50YHyG7mS9x6yfK2']; // Define who can add clubs

  return (
    <Router>
      <div>
        {user && <Navbar />} {/* Only show Navbar when user is logged in */}
        <Routes>
          {user ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/manage-clubs" element={<ManageClubs />} />
              {/* Protect the Add Club route */}
              {allowedToAddClubs.includes(user.uid) && (
                <Route path="/add-club" element={<AddClub />} />
              )}
              <Route path="/club/:id" element={<ClubDetail />} />
              <Route path="/user-profile/:id" element={<UserProfile />} />
              <Route path="/calendly-onboarding" element={<CalendlyOnboarding />} />
            </>
          ) : (
            <Route path="*" element={<Login />} />
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
