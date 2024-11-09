// src/components/Home.js

import React from 'react';
import ClubList from './ClubList';
import './Home.css'; // Linking to the CSS file for improved styling

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="header">Welcome to DukeBrew!</h1>

      <h2 className="clubs-heading">All Clubs</h2>
      <ClubList />
    </div>
  );
};

export default Home;
