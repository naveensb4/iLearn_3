import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage-container">
      <nav className="homepage-nav">
        <div className="logo">iLearn</div>
        <div className="nav-links">
          <Link to="/about">About</Link>
          <Link to="/events">Events</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </nav>
      <div className="homepage-content">
        <h1 className="homepage-title">Redefine Your Learning Experience</h1>
        <p className="homepage-description">
          Discover a new world of knowledge with cutting-edge events and expert connections.
        </p>
        <Link to="/events" className="homepage-cta">
          Explore Events
        </Link>
      </div>
      <div className="homepage-background"></div>
    </div>
  );
};

export default HomePage;