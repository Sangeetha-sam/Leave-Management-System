import React, { useEffect, useState } from 'react';
import { getMyLeaves } from '../utils/api';

const LeaveHistory = ({ user }) => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await getMyLeaves();
        setLeaves(res.data);
      } catch {}
    };
    fetchLeaves();
  }, []);

  return (
    <div>
      <h2>Leave History</h2>
      {leaves.length === 0 ? (
        <p>No leave requests found.</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Type</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave._id}>
                <td>{leave.leaveType}</td>
                <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                <td>{leave.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LeaveHistory;
