//  src/components/Register.js
import React, { useState, useMemo } from 'react';
import axios from 'axios';
import {
    Container, Box, Typography, TextField, Button, Alert,
    InputAdornment, IconButton, LinearProgress,
    FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

/* ------------------------------------------------------------------ */
/*  helpers                                                           */
/* ------------------------------------------------------------------ */
const pwRules = [
    { id: 'len',  test: p => p.length >= 8,         label: '≥8 characters' },
    { id: 'up',   test: p => /[A-Z]/.test(p),       label: '1 uppercase'   },
    { id: 'low',  test: p => /[a-z]/.test(p),       label: '1 lowercase'   },
    { id: 'num',  test: p => /[0-9]/.test(p),       label: '1 digit'       },
    { id: 'spec', test: p => /[@#$%^&+=!]/.test(p), label: '1 symbol'      }
];
const strongEnough = pw => pwRules.every(r => r.test(pw));
const strengthPct  = pw => (pwRules.filter(r => r.test(pw)).length / pwRules.length) * 100;

/* ------------------------------------------------------------------ */
/*  component                                                         */
/* ------------------------------------------------------------------ */
export default function Register() {
    const nav = useNavigate();

    const [form, setForm] = useState({
        username: '',
        fullName: '',          // ← new
        email: '',
        password: '',
        confirmPassword: '',
        role: 'TENNIS_PLAYER'
    });
    const [showPw,  setShowPw]  = useState(false);
    const [loading, setLoading] = useState(false);
    const [msg,     setMsg]     = useState({ type: '', text: '' });

    /* derived */
    const pwOk      = strongEnough(form.password);
    const pwMatch   = form.password === form.confirmPassword;
    const canSubmit = pwOk
        && pwMatch
        && form.username
        && form.fullName        // ← require full name
        && form.email
        && !loading;
    const pwStrengthVal = useMemo(() => strengthPct(form.password), [form.password]);

    const handleInput = e => setForm({ ...form, [e.target.name]: e.target.value });
    const handleRole  = e => setForm({ ...form, role: e.target.value });
    const togglePw    = () => setShowPw(p => !p);

    const submit = async e => {
        e.preventDefault();
        if (!canSubmit) return;
        setLoading(true);
        setMsg({});

        try {
            await axios.post('http://localhost:8080/api/auth/register', {
                username:        form.username,
                fullName:        form.fullName,        // ← send it
                email:           form.email,
                password:        form.password,
                confirmPassword: form.confirmPassword,
                role:            form.role
            });
            setMsg({ type: 'success', text: 'Account created – redirecting…' });
            setTimeout(() => nav('/login'), 1500);
        } catch (err) {
            let text = 'Registration failed. Please try again.';
            if (err.response?.status === 409) text = err.response.data;
            if (err.response?.status === 400) text = 'Invalid data.';
            setMsg({ type: 'error', text });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box component="form" onSubmit={submit} sx={{ mt: 7 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Sign Up
                </Typography>

                {msg.text && <Alert severity={msg.type} sx={{ mb: 2 }}>{msg.text}</Alert>}

                <TextField
                    label="Username" name="username" fullWidth required
                    value={form.username} onChange={handleInput} margin="normal"
                />

                <TextField
                    label="Full Name" name="fullName" fullWidth required
                    value={form.fullName} onChange={handleInput} margin="normal"
                />

                <TextField
                    label="Email" name="email" type="email" fullWidth required
                    value={form.email} onChange={handleInput} margin="normal"
                />

                <TextField
                    label="Password" name="password"
                    type={showPw ? 'text' : 'password'} fullWidth required margin="normal"
                    value={form.password} onChange={handleInput}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={togglePw} edge="end">
                                    {showPw ? <VisibilityOff/> : <Visibility/>}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />

                {form.password && (
                    <LinearProgress variant="determinate" value={pwStrengthVal}
                                    sx={{ height: 6, borderRadius: 1, mb: .5 }}/>
                )}

                <TextField
                    label="Confirm password" name="confirmPassword"
                    type={showPw ? 'text' : 'password'} fullWidth required margin="normal"
                    value={form.confirmPassword} onChange={handleInput}
                    error={!!form.confirmPassword && !pwMatch}
                    helperText={!pwMatch && 'Passwords differ'}
                />

                {form.password && (
                    <Box sx={{ fontSize: 13, mb: 1.5 }}>
                        {pwRules.map(r => (
                            <span key={r.id}
                                  style={{
                                      color: r.test(form.password) ? 'green' : '#b0b0b0',
                                      marginRight: 8
                                  }}>
                • {r.label}
              </span>
                        ))}
                    </Box>
                )}

                <FormControl fullWidth margin="normal">
                    <InputLabel id="roleLbl">Role</InputLabel>
                    <Select
                        labelId="roleLbl" label="Role" value={form.role}
                        onChange={handleRole} name="role"
                    >
                        <MenuItem value="TENNIS_PLAYER">Tennis Player</MenuItem>
                        <MenuItem value="REFEREE">Referee</MenuItem>
                        <MenuItem value="ADMIN">Administrator</MenuItem>
                    </Select>
                </FormControl>

                <Button variant="contained" fullWidth disabled={!canSubmit}
                        type="submit" sx={{ mt: 2 }}>
                    {loading ? 'Please wait…' : 'Sign Up'}
                </Button>
            </Box>
        </Container>
    );
}
