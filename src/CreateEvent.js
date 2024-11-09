// src/CreateEvent.js
import React, { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

const CreateEvent = () => {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLanguage, setEventLanguage] = useState('');
  const [eventLink, setEventLink] = useState('');

  const handleCreateEvent = async () => {
    if (!eventName || !eventDate || !eventDescription || !eventLanguage || !eventLink) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await addDoc(collection(db, 'events'), {
        name: eventName,
        date: eventDate,
        description: eventDescription,
        language: eventLanguage,
        link: eventLink,
        createdAt: new Date()
      });
      alert('Event created successfully!');
      // Clear input fields
      setEventName('');
      setEventDate('');
      setEventDescription('');
      setEventLanguage('');
      setEventLink('');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event');
    }
  };

  return (
    <div style={{ marginTop: '20px', padding: '20px', maxWidth: '500px', margin: 'auto' }}>
      <h2>Create a New Event</h2>
      <input
        type="text"
        placeholder="Event Name"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />
      <input
        type="date"
        value={eventDate}
        onChange={(e) => setEventDate(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />
      <textarea
        placeholder="Event Description"
        value={eventDescription}
        onChange={(e) => setEventDescription(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      ></textarea>
      <input
        type="text"
        placeholder="Language"
        value={eventLanguage}
        onChange={(e) => setEventLanguage(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />
      <input
        type="text"
        placeholder="Event Link (Zoom/Google Meet)"
        value={eventLink}
        onChange={(e) => setEventLink(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />
      <button
        onClick={handleCreateEvent}
        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', width: '100%' }}
      >
        Create Event
      </button>
    </div>
  );
};

export default CreateEvent;
