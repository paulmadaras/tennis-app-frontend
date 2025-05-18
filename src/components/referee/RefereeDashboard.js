// src/components/RefereeDashboard.js
import React from 'react';
import {
    AppBar, Toolbar, Typography, Container, Stack,
    Button, IconButton
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

export default function RefereeDashboard({ currentUserId }) {
    const navigate = useNavigate();

    const handleMySchedule   = () => navigate('/referee/matches');
    const handleManageScores = () => navigate('/referee/manage-scores');
    const handleSettings     = () => navigate('/settings');
    const handleLogout       = () => {
        // TODO: clear auth
        navigate('/login');
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Referee Dashboard
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
                    Welcome, Referee!
                </Typography>
                <Stack spacing={2} direction="column" alignItems="center">
                    <Button
                        variant="contained"
                        sx={{ width: '60%', height: '80px', fontSize: '1.2rem' }}
                        onClick={handleMySchedule}
                    >
                        My Schedule
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ width: '60%', height: '80px', fontSize: '1.2rem' }}
                        onClick={handleManageScores}
                    >
                        Manage Scores
                    </Button>
                </Stack>
            </Container>
        </>
    );
}
