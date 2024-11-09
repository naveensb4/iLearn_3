// src/components/MembersTable.js

import React from 'react';

const MembersTable = ({ title, members }) => {
  return (
    <div className="members-section">
      <h4>{title}</h4>
      {members && members.length > 0 ? (
        <table className="members-table">
          <thead>
            <tr>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td>{member.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No {title.toLowerCase()} yet.</p>
      )}
    </div>
  );
};

export default MembersTable;
