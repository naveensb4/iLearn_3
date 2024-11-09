// src/components/AddClub.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import './AddClub.css'; // Create and style this CSS file

const AddClub = () => {
  const [clubData, setClubData] = useState({
    name: '',
    description: '',
    website_link: '',
    logo_url: '',
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClubData({ ...clubData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'Clubs'), {
        ...clubData,
        adminIds: [],  // Admin IDs can be added here manually if needed
        members: [],
        joinRequests: [],
      });
      navigate('/');  // Redirect to home after successful creation
    } catch (error) {
      console.error('Error adding club: ', error);
    }
  };

  return (
    <div className="add-club-container">
      <h2>Add New Club</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={clubData.name}
          onChange={handleInputChange}
          placeholder="Club Name"
          required
        />
        <textarea
          name="description"
          value={clubData.description}
          onChange={handleInputChange}
          placeholder="Description"
          required
        ></textarea>
        <input
          type="text"
          name="website_link"
          value={clubData.website_link}
          onChange={handleInputChange}
          placeholder="Website Link"
        />
        <input
          type="text"
          name="logo_url"
          value={clubData.logo_url}
          onChange={handleInputChange}
          placeholder="Logo URL"
        />
        <button type="submit">Add Club</button>
      </form>
    </div>
  );
};

export default AddClub;
