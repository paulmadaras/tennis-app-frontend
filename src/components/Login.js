import React, { useState } from 'react';
import {
    Container, Box, Typography, TextField,
    Button, Snackbar, Alert, Link
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Login.css';

export default function Login({ onLogin }) {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [snackbar, setSnackbar] = useState({
        open: false, message: "", severity: "error"
    });

    const handleCloseSnackbar = (e, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleLogin = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/api/auth/login', null, {
            params: { username, password }
        })
            .then(response => {
                console.log('🔥 Login response:', response.data);
                let user, token;

                // New JWT flow?
                if (response.data.token && response.data.user) {
                    token = response.data.token;
                    user  = response.data.user;
                } else {
                    // Old flow: response.data is the user object
                    user = response.data;
                }

                // If we got a token, stash it
                if (token) {
                    localStorage.setItem('token', token);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                }

                // Lift user into App & persist
                if (onLogin) onLogin(user);
                localStorage.setItem('currentUser', JSON.stringify(user));

                // Navigate based on role
                if (user.role === 'TENNIS_PLAYER') {
                    navigate('/player/dashboard');
                } else if (user.role === 'REFEREE') {
                    navigate('/referee/dashboard');
                } else if (user.role === 'ADMIN') {
                    navigate('/admin/dashboard');
                } else {
                    setSnackbar({ open: true, message: "Unknown user role.", severity: "error" });
                }
            })
            .catch(error => {
                console.error("Login failed:", error);
                let errorMsg = "Login failed. Please try again.";
                if (error.response && error.response.data) {
                    errorMsg = error.response.data;
                }
                setSnackbar({ open: true, message: errorMsg, severity: "error" });
            });
    };

    return (
        <Container component="main" maxWidth="xs" className="login-container">
            <Box className="login-box">
                <Typography variant="h5" align="center">Sign in</Typography>
                <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
                    <TextField
                        margin="normal" required fullWidth
                        label="Username" autoFocus
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    <TextField
                        margin="normal" required fullWidth
                        label="Password" type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Sign In
                    </Button>
                    <Typography align="center" variant="body2">
                        <Link component={RouterLink} to="/forgot-password">
                            Forgot Password?
                        </Link>
                    </Typography>
                    <Typography align="center" variant="body2">
                        <Link component={RouterLink} to="/register">
                            Don't have an account? Sign Up
                        </Link>
                    </Typography>
                </Box>
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}
