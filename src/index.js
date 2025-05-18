// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from './App';
import './css/index.css'; // Optional global styles

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2'
        },
        background: {
            default: '#f4f6f8'
        }
    }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </React.StrictMode>
);
