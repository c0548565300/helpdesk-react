import React from 'react';
import { useAppSelector } from '../store/hooks';
import { CustomerDashboard } from '../components/CustomerDashboard';
import AgentDashboard from '../components/AgentDashboard';
import AdminDashboard from '../components/AdminDashboard';
import { Box, Container, Fade } from '@mui/material';

export const DashboardPage: React.FC = () => {
    const { user } = useAppSelector(state => state.auth);

    return (
        <Box sx={{ py: 4, minHeight: '80vh' }}>
            <Container maxWidth="xl">
                <Fade in={true} timeout={800}>
                    <Box>
                        {user?.role === 'customer' && <CustomerDashboard  />} 
                        {user?.role === 'agent' && <AgentDashboard />}
                        {user?.role === 'admin' && <AdminDashboard />}
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
};
