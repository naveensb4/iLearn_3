// src/components/ClubManagement.js

import React from 'react';
import JoinRequestTable from './JoinRequestTable';
import MembersTable from './MembersTable';

const ClubManagement = ({ club, clubDetails, onApprove, onReject }) => {
  return (
    <div className="club-management">
      <h3>{club.name}</h3>

      <JoinRequestTable requests={clubDetails?.joinRequestsDetails} onApprove={(userId) => onApprove(club.id, userId)} onReject={(userId) => onReject(club.id, userId)} />
      
      <MembersTable title="Approved Members" members={clubDetails?.approvedMembersDetails} />
      <MembersTable title="Rejected Members" members={clubDetails?.rejectedMembersDetails} />
    </div>
  );
};

export default ClubManagement;
