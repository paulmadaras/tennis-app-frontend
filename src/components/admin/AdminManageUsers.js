// src/components/AdminManageUsers.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    Paper,
    IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const AdminManageUsers = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8080/api/users')
            .then(response => setUsers(response.data))
            .catch(console.error);
    }, []);

    const handleUserClick = (userId) => {
        navigate(`/admin/user/${userId}/matches`);
    };

    const handleDelete = (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        axios.delete(`http://localhost:8080/api/users/${userId}`)
            .then(() => {
                setUsers(prev => prev.filter(u => u.id !== userId));
            })
            .catch(error => {
                console.error('Error deleting user:', error);
                alert('Failed to delete user.');
            });
    };

    return (
        <Container sx={{ marginTop: 4 }}>
            <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Manage Users
                </Typography>
                <List>
                    {users.map(user => (
                        <ListItem
                            key={user.id}
                            secondaryAction={
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() => handleDelete(user.id)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            }
                            disablePadding
                        >
                            <ListItemButton onClick={() => handleUserClick(user.id)}>
                                <ListItemText
                                    primary={user.username}
                                    secondary={user.email}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Container>
    );
};

export default AdminManageUsers;
