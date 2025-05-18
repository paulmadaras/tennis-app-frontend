// src/components/RefereeManageScores.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    TextField,
    Button,
    Paper,
    Stack
} from '@mui/material';

const RefereeManageScores = ({ currentUserId }) => {
    const [matches, setMatches] = useState([]);
    const [scores, setScores] = useState({});

    useEffect(() => {
        if (!currentUserId) return;
        axios
            .get(`http://localhost:8080/api/matches/referee/${currentUserId}/past`)
            .then(res => {
                setMatches(res.data);
                // Initialize input values
                const init = {};
                res.data.forEach(m => {
                    // prefill with existing score or blank
                    init[m.id] = m.score || '';
                });
                setScores(init);
            })
            .catch(err => console.error("Error loading referee matches:", err));
    }, [currentUserId]);

    const handleChange = (matchId, value) => {
        setScores(prev => ({ ...prev, [matchId]: value }));
    };

    const handleRecord = (matchId) => {
        axios
            .post(`http://localhost:8080/api/matches/${matchId}/score`, { score: scores[matchId] })
            .then(() => {
                // remove that match from the list once scored
                setMatches(ms => ms.filter(m => m.id !== matchId));
                alert('Score recorded');
            })
            .catch(err => {
                alert(err.response?.data || 'Error recording score');
            });
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Record Match Scores
            </Typography>
            <Paper sx={{ p: 2 }}>
                <List>
                    {matches.map(m => (
                        <ListItem key={m.id} sx={{ alignItems: 'flex-start' }}>
                            <ListItemText
                                primary={`${m.player1} vs ${m.player2}`}
                                secondary={`When: ${new Date(m.matchDateTime).toLocaleString()}`}
                            />
                            <Stack direction="row" spacing={1} alignItems="center">
                                <TextField
                                    label="Score"
                                    size="small"
                                    value={scores[m.id]}
                                    onChange={e => handleChange(m.id, e.target.value)}
                                />
                                <Button
                                    variant="contained"
                                    onClick={() => handleRecord(m.id)}
                                >
                                    Record
                                </Button>
                            </Stack>
                        </ListItem>
                    ))}
                    {matches.length === 0 && (
                        <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
                            No past matches to score.
                        </Typography>
                    )}
                </List>
            </Paper>
        </Container>
    );
};

export default RefereeManageScores;
