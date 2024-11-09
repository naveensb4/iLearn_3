import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './HomePage';
import AdminDashboard from './AdminDashboard';
import Profile from './UserProfile';
import Events from './EventList';
import CreateEvent from './CreateEvent';
import MentorApplication from './MentorApplication';
import Navbar from './Navbar';
import SignIn from './SignIn';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

const App = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role);
          } else {
            setRole('user'); // Fallback role assignment
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Navbar role={role} />
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/events" element={<Events />} />
        <Route path="/create-event" element={(role === 'admin' || role === 'mentor') ? <CreateEvent /> : <Navigate to="/home" />} />
        <Route path="/admin" element={role === 'admin' ? <AdminDashboard /> : <Navigate to="/home" />} />
        <Route path="/apply-mentor" element={role === 'user' ? <MentorApplication /> : <Navigate to="/home" />} />
        <Route path="/" element={<SignIn />} />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </div>
  );
};

export default App;
