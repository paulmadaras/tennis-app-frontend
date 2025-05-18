// src/components/PlayerDashboard.js
import React from 'react';
import {
    AppBar, Toolbar, Typography, Container, Stack,
    Button, IconButton
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

export default function PlayerDashboard({ currentUserId }) {
    const navigate = useNavigate();

    const handleTournamentRegistration = () => navigate('/player/tournaments');
    const handleMatchSchedule       = () => navigate('/player/my-upcoming-matches');
    const handleMatchScores         = () => navigate('/player/match-scores');
    const handleSettings            = () => navigate('/settings');
    const handleLogout              = () => {
        // TODO: clear your auth state here if needed
        navigate('/login');
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Dashboard
                    </Typography>
                    <IconButton color="inherit" onClick={handleSettings}>
                        <SettingsIcon />
                    </IconButton>
                    <IconButton color="inherit" onClick={handleLogout}>
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Container sx={{ marginTop: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Welcome, Player!
                </Typography>
                <Stack spacing={2} direction="column" alignItems="center">
                    <Button
                        variant="contained"
                        sx={{ width: '60%', height: '80px', fontSize: '1.2rem' }}
                        onClick={handleTournamentRegistration}
                    >
                        Tournament Registration
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ width: '60%', height: '80px', fontSize: '1.2rem' }}
                        onClick={handleMatchSchedule}
                    >
                        Match Schedule
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ width: '60%', height: '80px', fontSize: '1.2rem' }}
                        onClick={handleMatchScores}
                    >
                        Match Scores
                    </Button>
                </Stack>
            </Container>
        </>
    );
}
