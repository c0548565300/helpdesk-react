import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchTickets } from "../store/ticketSlice";
import {
    Container,
    Box, CircularProgress, Alert
} from "@mui/material";
import { CustomerDashboard } from "../components/CustomerDashboard";
import AdminDashboard from "../components/AdminDashboard";
import AgentDashboard from "../components/AgentDashboard";

export const DashboardPage: React.FC = () => {
    const dispatch = useAppDispatch();

    const { user } = useAppSelector(state => state.auth);
    const { tickets, loading, error } = useAppSelector(state => state.ticket);

    useEffect(() => {
        dispatch(fetchTickets());
    }, [dispatch]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">אופס! קרתה שגיאה: {error}</Alert>
            </Container>
        );
    }


    return (
        <Container>
            {user?.role === 'admin' && <AdminDashboard tickets={tickets} />}
            {user?.role === 'agent' && <AgentDashboard tickets={tickets} />}
            {user?.role === 'customer' && <CustomerDashboard tickets={tickets} />}
        </Container>
    );
};

export default DashboardPage;