// src/components/PlayerPastMatches.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    Paper
} from '@mui/material';

const PlayerPastMatches = ({ currentUserId }) => {
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        if (!currentUserId) return;
        axios
            .get(`http://localhost:8080/api/matches/player/${currentUserId}/past`)
            .then(res => setMatches(res.data))
            .catch(err => console.error("Error loading past matches:", err));
    }, [currentUserId]);

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                My Past Matches & Scores
            </Typography>
            <Paper sx={{ p: 2 }}>
                <List>
                    {matches.map(m => (
                        <ListItem key={m.id}>
                            <ListItemText
                                primary={`${m.player1} vs ${m.player2}`}
                                secondary={`Score: ${m.score ?? 'TBD'} — Played on ${new Date(
                                    m.matchDateTime
                                ).toLocaleString()}`}
                            />
                        </ListItem>
                    ))}
                    {matches.length === 0 && (
                        <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
                            You have no past matches yet.
                        </Typography>
                    )}
                </List>
            </Paper>
        </Container>
    );
};

export default PlayerPastMatches;
