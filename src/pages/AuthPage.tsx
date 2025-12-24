import React, { useEffect, useState } from 'react';
import { Container, Paper, Tabs, Tab, Box, Typography, Divider } from '@mui/material';
import { LoginPage } from './LoginPage';
import { RegisterPage } from './RegisterPage';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

export const AuthPage: React.FC = () => {
    const [tabValue, setTabValue] = useState(0);
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, navigate]);
    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8, mb: 4 }}>
            <Paper elevation={10} sx={{ borderRadius: 4, overflow: 'hidden' }}>
                <Box sx={{ bgcolor: 'primary.main', py: 3, textAlign: 'center', color: 'white' }}>
                    <Typography variant="h4" fontWeight="bold">HelpDesk</Typography>
                    <Typography variant="body2">מערכת ניהול קריאות שירות</Typography>
                </Box>

                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab label="התחברות" sx={{ fontWeight: 'bold' }} />
                    <Tab label="הרשמה" sx={{ fontWeight: 'bold' }} />
                </Tabs>

                <Divider />

                <Box sx={{ p: 4 }}>
                    {tabValue === 0 ? (
                        <LoginPage />
                    ) : (
                        <RegisterPage />
                    )}
                </Box>
            </Paper>
        </Container>
    );
};