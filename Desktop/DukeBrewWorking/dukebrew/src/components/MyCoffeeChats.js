// src/components/MyCoffeeChats.js

import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

const MyCoffeeChats = () => {
  const [user] = useAuthState(auth);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      if (user) {
        const chatsRef = collection(db, 'CoffeeChats');
        const q = query(chatsRef, where('requesterId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const chatList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setChats(chatList);
      }
    };
    fetchChats();
  }, [user]);

  return (
    <div>
      <h2>My Coffee Chats</h2>
      {chats.length > 0 ? (
        chats.map(chat => (
          <div key={chat.id}>
            <p>Date: {new Date(chat.date).toLocaleDateString()}</p>
            <p>Time: {chat.startTime} - {chat.endTime}</p>
            <p>Status: {chat.status}</p>
          </div>
        ))
      ) : (
        <p>No coffee chats booked yet.</p>
      )}
    </div>
  );
};

export default MyCoffeeChats;
