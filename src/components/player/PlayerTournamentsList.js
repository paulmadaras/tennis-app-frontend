// src/components/PlayerTournamentsList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Container, Typography, List, ListItem,
    ListItemText, Button, Paper
} from '@mui/material';

export default function PlayerTournamentsList({ currentUserId }) {

    const [items, setItems] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/tournaments/user/${currentUserId}`)
            .then(({ data }) => setItems(data))
            .catch(console.error);
    }, [currentUserId]);

    const handleRegister = (id) => {
        axios.post(`http://localhost:8080/api/tournaments/${id}/enroll/${currentUserId}`)
            .then(() => {
                setItems(xs => xs.map(x =>
                    x.id === id ? { ...x, status: 'PENDING' } : x
                ));
            })
            .catch(err => alert(err.response?.data || 'Failed'));
    };

    const label = (s) => s === 'APPROVED' ? 'Enrolled'
        : s === 'PENDING'  ? 'Pending'
            : 'Register';

    return (
        <Container sx={{ mt: 4 }}>
            <Paper sx={{ p: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Tournaments
                </Typography>

                <List>
                    {items.map(t => (
                        <ListItem key={t.id}>
                            <ListItemText
                                primary={t.name}
                                secondary={`Starts ${t.start} – Ends ${t.end}`}
                            />
                            <Button
                                variant="contained"
                                disabled={t.status !== 'NONE'}
                                onClick={() => handleRegister(t.id)}
                            >
                                {label(t.status)}
                            </Button>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Container>
    );
}
