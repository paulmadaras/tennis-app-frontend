import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage({ currentUserId }) {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Fetch the logged-in user’s data by their ID
        fetch(`http://localhost:8080/api/users/${currentUserId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            // if you’re using cookie-based sessions:
            // credentials: 'include'
        })
            .then((res) => {
                if (res.status === 401) {
                    // not authenticated → back to login
                    return navigate('/login', { replace: true });
                }
                if (!res.ok) {
                    throw new Error(`Server returned ${res.status}`);
                }
                return res.json();
            })
            .then((user) => {
                setFormData({
                    fullName: user.fullName || '',
                    email: user.email || '',
                    password: '',
                    confirmPassword: ''
                });
            })
            .catch((err) => setError('Could not load your profile: ' + err.message))
            .finally(() => setLoading(false));
    }, [currentUserId, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        if (!formData.fullName.trim() || !formData.email.trim()) {
            setError('Full name and email are required');
            return false;
        }
        // simple email check
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Invalid email format');
            return false;
        }
        if (formData.password && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validate()) return;

        setSaving(true);

        const payload = {
            fullName: formData.fullName,
            email: formData.email,
            // only send password if non-empty
            ...(formData.password ? { password: formData.password } : {})
        };

        fetch(`http://localhost:8080/api/users/${currentUserId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            // credentials: 'include',  // if session-based
            body: JSON.stringify(payload)
        })
            .then((res) => {
                if (!res.ok) throw new Error(`Server returned ${res.status}`);
                return res.json();
            })
            .then((updated) => {
                setSuccess('Account updated successfully');
                // blank out the password fields
                setFormData((f) => ({ ...f, password: '', confirmPassword: '' }));
            })
            .catch((err) => setError('Save failed: ' + err.message))
            .finally(() => setSaving(false));
    };

    if (loading) {
        return (
            <Container sx={{ mt: 4, textAlign: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Account Settings
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="New Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    margin="normal"
                />

                <Button
                    type="submit"
                    variant="contained"
                    disabled={saving}
                    sx={{ mt: 3 }}
                >
                    {saving ? 'Saving…' : 'Save Changes'}
                </Button>
            </form>
        </Container>
    );
}
