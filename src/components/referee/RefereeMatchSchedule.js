// src/components/UpcomingMatches.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container, Typography, List, ListItem, ListItemText, Paper
} from '@mui/material';

const MatchSchedule = ({ currentUserId }) => {
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/matches/referee/${currentUserId}/upcoming`)
            .then(res => setMatches(res.data))
            .catch(console.error);
    }, [currentUserId]);

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                My Upcoming Matches
            </Typography>
            <Paper sx={{ p: 2 }}>
                <List>
                    {matches.map(m => (
                        <ListItem key={m.id}>
                            <ListItemText
                                primary={`${m.player1} vs ${m.player2}`}
                                secondary={`When: ${new Date(m.matchDateTime).toLocaleString()}`}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Container>
    );
};

export default MatchSchedule;
