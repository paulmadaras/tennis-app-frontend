// src/components/UserMatches.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Paper,
    TextField,
    Button,
    FormHelperText
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useParams } from 'react-router-dom';

// Validate tennis score: each set is "x-y" where (x>=6 or y>=6) and |x-y|>=2, or tiebreak 7-6 / 6-7
function isValidTennisScore(score) {
    if (!score) return false;
    const sets = score.trim().split(/\s+/);
    for (let set of sets) {
        const parts = set.split('-');
        if (parts.length !== 2) return false;
        const a = parseInt(parts[0], 10);
        const b = parseInt(parts[1], 10);
        if (isNaN(a) || isNaN(b) || a < 0 || b < 0) return false;
        // tiebreak allowed 7-6 or 6-7
        if ((a === 7 && b === 6) || (a === 6 && b === 7)) {
            continue;
        }
        // must have at least 6 games and 2-game difference
        if ((a >= 6 || b >= 6) && Math.abs(a - b) >= 2) {
            continue;
        }
        return false;
    }
    return true;
}

const UserMatches = () => {
    const { userId } = useParams();
    const [matches, setMatches] = useState([]);
    const [editingMatchId, setEditingMatchId] = useState(null);
    const [editedMatch, setEditedMatch] = useState({});
    const [scoreError, setScoreError] = useState(false);

    const fetchMatches = () => {
        axios.get(`http://localhost:8080/api/matches/player/${userId}`)
            .then(response => setMatches(response.data))
            .catch(error => console.error('Error fetching matches:', error));
    };

    useEffect(() => {
        fetchMatches();
    }, [userId]);

    const handleDelete = id => {
        axios.delete(`http://localhost:8080/api/matches/${id}`)
            .then(() => fetchMatches())
            .catch(error => console.error('Error deleting match:', error));
    };

    const handleEditClick = match => {
        setEditingMatchId(match.id);
        setEditedMatch({ ...match });
        setScoreError(false);
    };

    const handleUpdate = id => {
        if (scoreError) return;
        axios.put(`http://localhost:8080/api/matches/${id}`, editedMatch)
            .then(() => {
                setEditingMatchId(null);
                setEditedMatch({});
                fetchMatches();
            })
            .catch(error => console.error('Error updating match:', error));
    };

    const handleCancel = () => {
        setEditingMatchId(null);
        setEditedMatch({});
        setScoreError(false);
    };

    const handleInputChange = (e, field) => {
        const value = e.target.value;
        setEditedMatch(prev => ({ ...prev, [field]: value }));

        if (field === 'score') {
            const valid = isValidTennisScore(value);
            setScoreError(value.trim() !== '' && !valid);
        }
    };

    return (
        <Container sx={{ marginTop: 4 }}>
            <Paper sx={{ padding: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Matches for User {userId}
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>Player 1</TableCell>
                            <TableCell>Player 2</TableCell>
                            <TableCell>Score</TableCell>
                            <TableCell>Referee</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {matches.map(match => (
                            <TableRow key={match.id}>
                                <TableCell>{match.id}</TableCell>
                                <TableCell>
                                    {editingMatchId === match.id ? (
                                        <TextField
                                            type="datetime-local"
                                            value={editedMatch.matchDateTime || ''}
                                            onChange={e => handleInputChange(e, 'matchDateTime')}
                                        />
                                    ) : (
                                        match.matchDateTime
                                    )}
                                </TableCell>
                                <TableCell>{match.player1?.username}</TableCell>
                                <TableCell>{match.player2?.username}</TableCell>
                                <TableCell>
                                    {editingMatchId === match.id ? (
                                        <>
                                            <TextField
                                                label="Score"
                                                value={editedMatch.score || ''}
                                                error={scoreError}
                                                onChange={e => handleInputChange(e, 'score')}
                                            />
                                            {scoreError && (
                                                <FormHelperText error>
                                                    Invalid tennis score. Each set must be at least 6 games and won by 2, or tiebreaker 7-6.
                                                </FormHelperText>
                                            )}
                                        </>
                                    ) : (
                                        match.score
                                    )}
                                </TableCell>
                                <TableCell>
                                    {match.referee
                                        ? `${match.referee.username}`
                                        : '—'}
                                </TableCell>
                                <TableCell>
                                    {editingMatchId === match.id ? (
                                        <>
                                            <Button variant="contained" onClick={() => handleUpdate(match.id)}>
                                                Save
                                            </Button>
                                            <Button variant="outlined" onClick={handleCancel} sx={{ ml: 1 }}>
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <IconButton onClick={() => handleEditClick(match)} color="primary">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(match.id)} color="error">
                                                <DeleteIcon />
                                            </IconButton>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
};

export default UserMatches;
