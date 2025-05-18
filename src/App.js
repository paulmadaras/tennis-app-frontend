// src/App.js
import React from 'react';
import axios from 'axios';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import PlayerDashboard from './components/player/PlayerDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import RefereeDashboard from './components/referee/RefereeDashboard';
import AdminManageUsers from './components/admin/AdminManageUsers';
import UserMatches from './components/UserMatches';
import PlayerTournamentsList from './components/player/PlayerTournamentsList';
import PlayerMatchSchedule from './components/player/PlayerMatchSchedule';
import PlayerPastMatches from './components/player/PlayerPastMatches';
import SettingsPage from './components/SettingsPage';
import RefereeManageScores from './components/referee/RefereeManageScores';
import MatchScheduleReferee from './components/referee/RefereeMatchSchedule';
import AdminRegistrations from './components/admin/AdminRegistration';

class App extends React.Component {
    constructor(props) {
        super(props);
        const storedUser = localStorage.getItem('currentUser');
        const token = localStorage.getItem('token');
        let currentUser = null;
        // Only load user if there's also a token
        if (storedUser && token) {
            try {
                currentUser = JSON.parse(storedUser);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            } catch (e) {
                console.warn('Could not parse stored user, clearing cache', e);
                localStorage.removeItem('currentUser');
            }
        }
        this.state = { currentUser };
    }

    handleLogin = (user) => {
        this.setState({ currentUser: user });
    };

    handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        delete axios.defaults.headers.common['Authorization'];
        this.setState({ currentUser: null });
    };

    render() {
        const { currentUser } = this.state;
        console.log('🔒 currentUser:', currentUser);

        return (
            <Router>
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Login onLogin={this.handleLogin} />} />
                    <Route path="/login" element={<Login onLogin={this.handleLogin} />} />
                    <Route path="/register" element={<Register />} />
                    {/* Settings (all authenticated users) */}
                    <Route
                        path="/settings"
                        element={
                            currentUser
                                ? <SettingsPage currentUserId={currentUser.id} />
                                : <Navigate to="/login" replace />
                        }
                    />

                    {/* Tennis player routes */}
                    <Route
                        path="/player/dashboard"
                        element={
                            currentUser?.role === 'TENNIS_PLAYER'
                                ? <PlayerDashboard currentUserId={currentUser.id} />
                                : <Navigate to="/login" replace />
                        }
                    />
                    <Route
                        path="/player/match-scores"
                        element={
                            currentUser?.role === 'TENNIS_PLAYER'
                                ? <PlayerPastMatches currentUserId={currentUser.id} />
                                : <Navigate to="/login" replace />
                        }
                    />
                    <Route
                        path="/player/tournaments"
                        element={
                            currentUser?.role === 'TENNIS_PLAYER'
                                ? <PlayerTournamentsList currentUserId={currentUser.id} />
                                : <Navigate to="/login" replace />
                        }
                    />

                    <Route
                        path="/player/my-upcoming-matches"
                        element={
                            currentUser?.role === 'TENNIS_PLAYER'
                                ? <PlayerMatchSchedule currentUserId={currentUser.id} />
                                : <Navigate to="/login" replace />
                        }
                    />

                    {/* Referee routes */}
                    <Route
                        path="/referee/dashboard"
                        element={
                            currentUser?.role === 'REFEREE'
                                ? <RefereeDashboard currentUserId={currentUser.id} />
                                : <Navigate to="/login" replace />
                        }
                    />
                    <Route
                        path="/referee/my-upcoming-matches"
                        element={
                            currentUser?.role === 'REFEREE'
                                ? <PlayerMatchSchedule currentUserId={currentUser.id} />
                                : <Navigate to="/login" replace />
                        }
                    />
                    <Route
                        path="/referee/matches"
                        element={
                            currentUser?.role === 'REFEREE'
                                ? <MatchScheduleReferee currentUserId={currentUser.id} />
                                : <Navigate to="/login" replace />
                        }
                    />
                    <Route
                        path="/referee/manage-scores"
                        element={
                            currentUser?.role === 'REFEREE'
                                ? <RefereeManageScores currentUserId={currentUser.id} />
                                : <Navigate to="/login" replace />
                        }
                    />

                    {/* admin routes */}
                    <Route
                        path="/admin/dashboard"
                        element={
                            currentUser?.role === 'ADMIN'
                                ? <AdminDashboard
                                    currentUserId={currentUser.id}
                                    onLogout={this.handleLogout}
                                />
                                : <Navigate to="/login" replace />
                        }
                    />
                    <Route
                        path="/admin/manage-users"
                        element={
                            currentUser?.role === 'ADMIN'
                                ? <AdminManageUsers currentUserId={currentUser.id} />
                                : <Navigate to="/login" replace />
                        }
                    />
                    <Route
                        path="/admin/user/:userId/matches"
                        element={
                            currentUser?.role === 'ADMIN'
                                ? <UserMatches currentUserId={currentUser.id} />
                                : <Navigate to="/login" replace />
                        }
                    />

                    <Route
                        path="/admin/registrations"
                        element={
                            currentUser?.role === 'ADMIN'
                                ? <AdminRegistrations />
                                : <Navigate to="/login" replace />
                        }
                    />


                    {/* Catch-all */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        );
    }
}

export default App;
