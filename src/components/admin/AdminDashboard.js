// src/components/AdminDashboard.js
import React from 'react';
import {
    AppBar, Toolbar, Typography, Container, Stack,
    Button, IconButton
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard({ currentUserId, onLogout }) {
    const navigate = useNavigate();

    const handleManageUsers       = () => navigate('/admin/manage-users');
    const handleSettings          = () => navigate('/settings');
    const handlePendingRegs       = () => navigate('/admin/registrations');
    const handleLogout            = () => {
        // clear App state + storage
        if (onLogout) onLogout();
        // redirect to login
        navigate('/login');
    };

    const handleExportMatches = () => {
        axios.get('http://localhost:8080/api/admin/matches/export?format=csv', {
            responseType: 'blob'
        })
            .then(response => {
                const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'matches.csv');
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            })
            .catch(err => {
                console.error('Error exporting CSV:', err);
                alert('Failed to export matches as CSV.');
            });
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Admin Dashboard
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
                    Welcome, Admin!
                </Typography>
                <Stack spacing={2} direction="column" alignItems="center">
                    <Button
                        variant="contained"
                        sx={{ width: '60%', height: '80px', fontSize: '1.2rem' }}
                        onClick={handleManageUsers}
                    >
                        Manage Users
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ width: '60%', height: '80px', fontSize: '1.2rem' }}
                        onClick={handlePendingRegs}
                    >
                        Pending Registrations
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        sx={{ width: '60%', height: '80px', fontSize: '1.2rem' }}
                        onClick={handleExportMatches}
                    >
                        Export Matches CSV
                    </Button>
                </Stack>
            </Container>
        </>
    );
}
