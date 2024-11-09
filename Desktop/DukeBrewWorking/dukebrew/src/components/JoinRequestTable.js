// src/components/JoinRequestTable.js

import React from 'react';

const JoinRequestTable = ({ requests, onApprove, onReject }) => {
  return (
    <div className="join-requests-section">
      <h4>Join Requests</h4>
      {requests && requests.length > 0 ? (
        <table className="request-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td>{request.name}</td>
                <td>
                  <button className="approve-btn" onClick={() => onApprove(request.id)}>Approve</button>
                  <button className="reject-btn" onClick={() => onReject(request.id)}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No join requests.</p>
      )}
    </div>
  );
};

export default JoinRequestTable;
