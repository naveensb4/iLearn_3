import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import './Navbar.css'; // Importing the CSS file for styling

const Navbar = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/'); // Redirect to sign-in page after logout
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isAdmin = role === 'admin';
  const isMentor = role === 'mentor';
  const isUser = role === 'user';

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>iLearn</h1>
      </div>
      <div className="navbar-links">
        <Link to="/home" className="navbar-link">Home</Link>
        <Link to="/events" className="navbar-link">Events</Link>

        {isUser && (
          <Link to="/apply-mentor" className="navbar-link">Apply to be a Mentor</Link>
        )}

        {(isAdmin || isMentor) && (
          <Link to="/create-event" className="navbar-link">Create Event</Link>
        )}

        {isAdmin && (
          <Link to="/admin" className="navbar-link">Admin Dashboard</Link>
        )}

        <Link to="/profile" className="navbar-link">Profile</Link>
        <button onClick={handleLogout} className="navbar-button">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
