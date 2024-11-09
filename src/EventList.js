import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import './EventList.css';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'events'));
        const eventsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEvents(eventsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  return (
    <div className="event-list-container">
      <h2 className="event-list-title">Upcoming Events</h2>
      {events.length === 0 ? (
        <p className="no-events-message">No events available at the moment. Check back soon!</p>
      ) : (
        <div className="event-card-grid">
          {events.map(event => (
            <div key={event.id} className="event-card">
              <div className="event-card-content">
                <h3 className="event-title">{event.name}</h3>
                <p className="event-date">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="event-description">{event.description}</p>
                <p className="event-language">Language: {event.language}</p>
              </div>
              <a href={event.link} target="_blank" rel="noopener noreferrer" className="event-link">
                Join Event
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;