import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const ClubList = () => {
  const [clubs, setClubs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClubs = async () => {
      const clubCollection = collection(db, 'Clubs');
      const clubSnapshot = await getDocs(clubCollection);
      const clubList = clubSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClubs(clubList);
    };
    fetchClubs();
  }, []);

  const handleClubClick = (id) => {
    navigate(`/club/${id}`);
  };

  return (
    <div className="club-list">
      {clubs.map((club) => (
        <div key={club.id} className="club-card" onClick={() => handleClubClick(club.id)}>
          <img src={club.logo_url} alt={`${club.name} Logo`} className="club-logo" />
          <h3>{club.name}</h3>
        </div>
      ))}
    </div>
  );
};

export default ClubList;