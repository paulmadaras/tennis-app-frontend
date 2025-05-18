// src/components/UserList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Make GET request to your backend endpoint
        axios.get('http://localhost:8080/api/users')
            .then(response => {
                // On success, update state with returned data
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    }, []); // The empty dependency array ensures this runs once when component mounts.

    return (
        <div>
            <h2>User List</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.username} - {user.email} - {user.role}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
