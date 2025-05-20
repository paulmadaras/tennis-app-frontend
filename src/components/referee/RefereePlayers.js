// src/components/RefereePlayers.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    TextField,
    Select,
    MenuItem,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Box,
    FormControl,
    InputLabel
} from '@mui/material';

export default function RefereePlayers() {
    const [players, setPlayers] = useState([]);
    const [minMatches, setMin]   = useState(0);
    const [maxMatches, setMax]   = useState(9999);
    const [sortBy, setSortBy]     = useState('alpha'); // 'alpha', 'matchesAsc', 'matchesDesc'
    const token = localStorage.getItem('token');

    const fetchPlayers = () => {
        axios.get('http://localhost:8080/api/referee/players', {
            headers: { Authorization: `Bearer ${token}` },
            params:  { minMatches, maxMatches, sortBy }
        })
            .then(({ data }) => setPlayers(data))
            .catch(err => {
                console.error('Failed to load players:', err);
                setPlayers([]);
            });
    };

    // Re-fetch whenever filters or sort order change
    useEffect(fetchPlayers, [minMatches, maxMatches, sortBy]);

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Players
            </Typography>

            <Paper sx={{ p: 2, mb: 3 }}>
                <Box
                    component="form"
                    sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}
                    onSubmit={e => { e.preventDefault(); fetchPlayers(); }}
                >
                    <TextField
                        label="Min Matches"
                        type="number"
                        value={minMatches}
                        onChange={e => setMin(Math.max(0, parseInt(e.target.value, 10) || 0))}
                        InputProps={{ inputProps: { min: 0 } }}
                    />
                    <TextField
                        label="Max Matches"
                        type="number"
                        value={maxMatches}
                        onChange={e => setMax(Math.max(0, parseInt(e.target.value, 10) || 0))}
                        InputProps={{ inputProps: { min: 0 } }}
                    />
                    <FormControl sx={{ minWidth: 160 }}>
                        <InputLabel id="sort-label">Sort By</InputLabel>
                        <Select
                            labelId="sort-label"
                            label="Sort By"
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                        >
                            <MenuItem value="alpha">Alphabetical</MenuItem>
                            <MenuItem value="matchesAsc">Matches ↑</MenuItem>
                            <MenuItem value="matchesDesc">Matches ↓</MenuItem>
                        </Select>
                    </FormControl>
                    <Button type="submit" variant="contained" sx={{ height: '56px' }}>
                        Apply
                    </Button>
                </Box>
            </Paper>

            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell>Full Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell align="right">Matches Played</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {players.map(p => (
                            <TableRow key={p.id}>
                                <TableCell>{p.username}</TableCell>
                                <TableCell>{p.fullName}</TableCell>
                                <TableCell>{p.email}</TableCell>
                                <TableCell align="right">{p.matchCount}</TableCell>
                            </TableRow>
                        ))}
                        {players.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    No players match these criteria.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
}
