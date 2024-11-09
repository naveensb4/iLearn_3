import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [applications, setApplications] = useState({
    pending: [],
    approved: [],
    rejected: []
  });
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAndFetchApplications = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          setIsAdmin(true);
          await fetchApplications();
        } else {
          navigate('/home'); // Redirect non-admin users
        }
      } else {
        navigate('/'); // Redirect unauthenticated users
      }
    };

    checkAdminAndFetchApplications();
  }, [navigate]);

  const fetchApplications = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'mentorApplications'));
      const appData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Categorize applications by status
      const categorizedApps = appData.reduce((acc, app) => {
        acc[app.status].push(app);
        return acc;
      }, { pending: [], approved: [], rejected: [] });

      setApplications(categorizedApps);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (id, newStatus) => {
    try {
      const applicationRef = doc(db, 'mentorApplications', id);
      
      // Update application status in Firestore
      await updateDoc(applicationRef, { status: newStatus });
      
      // If approved, update user's role to 'mentor'
      if (newStatus === 'approved') {
        const application = applications.pending.find(app => app.id === id);
        if (application) {
          const userRef = doc(db, 'users', application.userId);
          await updateDoc(userRef, { role: 'mentor' });
        }
      }
      
      // Update local state to reflect changes
      const updatedApplications = { ...applications };
      ['pending', 'approved', 'rejected'].forEach(status => {
        const index = updatedApplications[status].findIndex(app => app.id === id);
        if (index !== -1) {
          const [app] = updatedApplications[status].splice(index, 1);
          app.status = newStatus;
          updatedApplications[newStatus].push(app);
        }
      });
      setApplications(updatedApplications);
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Failed to update application status. Please try again.');
    }
  };

  const ApplicationList = ({ title, apps, showActions }) => (
    <div>
      <h3>{title} ({apps.length})</h3>
      {apps.map(app => (
        <div key={app.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          <h4>{app.name}</h4>
          <p><strong>Reason:</strong> {app.reason}</p>
          <p><strong>Topic:</strong> {app.topic}</p>
          <p><strong>Languages:</strong> {app.languages}</p>
          <p><strong>LinkedIn:</strong> <a href={app.linkedIn} target="_blank" rel="noopener noreferrer">{app.linkedIn}</a></p>
          {showActions && (
            <div>
              <button 
                onClick={() => handleApproval(app.id, 'approved')} 
                style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: 'green', color: 'white', border: 'none', cursor: 'pointer' }}
              >
                Approve
              </button>
              <button 
                onClick={() => handleApproval(app.id, 'rejected')}
                style={{ padding: '5px 10px', backgroundColor: 'red', color: 'white', border: 'none', cursor: 'pointer' }}
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  if (loading) return <div>Loading applications...</div>;
  if (!isAdmin) return null;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h2>Admin Dashboard - Mentor Applications</h2>
      <ApplicationList title="Pending Applications" apps={applications.pending} showActions={true} />
      <ApplicationList title="Approved Applications" apps={applications.approved} showActions={false} />
      <ApplicationList title="Rejected Applications" apps={applications.rejected} showActions={false} />
    </div>
  );
};

export default AdminDashboard;
