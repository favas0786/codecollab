// client/src/components/UserList.jsx
import React from 'react';

const UserList = ({ users }) => {
    return (
        <div className="user-list">
            <h4>Active Users</h4>
            <ul>
                {users.map((user) => (
                    <li key={user.socketId}>{user.username}</li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;