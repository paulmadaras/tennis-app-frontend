// src/components/AdminRegistrations.js
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
    Container, Typography, Table, TableHead,
    TableRow, TableCell, TableBody, Button, Paper
} from '@mui/material'

/** Page where an ADMIN approves / rejects tournament requests */
export default function AdminRegistrations() {
    const [rows, setRows] = useState([])

    /* ---------- fetch on mount ---------- */
    useEffect(() => {
        axios.get('http://localhost:8080/api/admin/registrations', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(({ data }) => setRows(data))
            .catch(err => console.error('Cannot load pending registrations:', err))
    }, [])

    /* ---------- common PUT helper ---------- */
    const doAction = (userId, tournamentId, action) => {
        axios.put(
            `http://localhost:8080/api/admin/registrations/${userId}/${tournamentId}/${action}`,
            null,
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        )
            .then(() => setRows(rs =>
                rs.filter(r => !(r.userId === userId && r.tournamentId === tournamentId))
            ))
            .catch(err => console.error('Failed to update status', err))
    }

    return (
        <Container sx={{ mt: 4 }}>
            <Paper sx={{ p: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Pending Tournament Registrations
                </Typography>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>User</TableCell>
                            <TableCell>Tournament</TableCell>
                            <TableCell>Requested&nbsp;At</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {rows.map(r => (
                            <TableRow key={`${r.userId}-${r.tournamentId}`}>
                                <TableCell>{r.username}</TableCell>
                                <TableCell>{r.tournamentName}</TableCell>
                                <TableCell>
                                    {new Date(r.requestedAt).toLocaleString()}
                                </TableCell>
                                <TableCell align="right">
                                    <Button
                                        size="small"
                                        variant="contained"
                                        sx={{ mr: 1 }}
                                        onClick={() => doAction(r.userId, r.tournamentId, 'approve')}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="error"
                                        onClick={() => doAction(r.userId, r.tournamentId, 'reject')}
                                    >
                                        Reject
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {rows.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    (No pending registrations)
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    )
}
