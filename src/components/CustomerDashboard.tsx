import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import {
    Container, Typography, Grid ,Card, CardContent, // שים לב: Grid2 as Grid
    Box, Button, Chip, Avatar, Paper, IconButton
} from "@mui/material";
// ייבוא אייקונים
import AddIcon from '@mui/icons-material/Add';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import type { Ticket } from "../types/models";

interface CustomerDashboardProps {
    tickets: Ticket[];
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ tickets }) => {
    const { user } = useAppSelector(state => state.auth);
    const navigate = useNavigate();

    const openTickets = tickets.filter(t => t.status_name !== 'Closed').length;

    return (
        <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
            {/* כותרת ראשית */}
            <Box mb={5}>
                <Typography variant="h4" sx={{ fontWeight: '800', color: '#2c3e50' }}>
                    שלום, {user?.name} 👋
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    ברוך הבא למרכז השירות האישי שלך
                </Typography>
            </Box>

            {/* Grid החדש - שימוש ב-size וללא item */}
            <Grid container spacing={3} mb={6}>
                
                {/* כרטיס 1: סה"כ */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                        color: 'white',
                        borderRadius: 4,
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                        transition: '0.3s',
                        '&:hover': { transform: 'translateY(-5px)' }
                    }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56, mr: 2 }}>
                                <ConfirmationNumberIcon fontSize="large" />
                            </Avatar>
                            <Box>
                                <Typography variant="h3" fontWeight="bold">{tickets.length}</Typography>
                                <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>סה"כ פניות שלי</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* כרטיס 2: פתוחות */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ 
                        background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', 
                        color: '#fff',
                        borderRadius: 4,
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                        transition: '0.3s',
                        '&:hover': { transform: 'translateY(-5px)' }
                    }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56, mr: 2 }}>
                                <PendingActionsIcon fontSize="large" />
                            </Avatar>
                            <Box>
                                <Typography variant="h3" fontWeight="bold">{openTickets}</Typography>
                                <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>פניות בטיפול</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* כרטיס 3: כפתור פעולה */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<AddIcon sx={{ fontSize: 40 }} />}
                        onClick={() => navigate('/tickets/new')}
                        sx={{
                            height: '100%',
                            minHeight: '100px',
                            background: '#2c3e50',
                            borderRadius: 4,
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            boxShadow: '0 8px 16px rgba(44, 62, 80, 0.3)',
                            '&:hover': { background: '#1a252f', transform: 'scale(1.02)' }
                        }}
                    >
                        פתיחת פנייה חדשה
                    </Button>
                </Grid>
            </Grid>

            {/* רשימת פניות אחרונות */}
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                פניות אחרונות
            </Typography>

            {tickets.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4, bgcolor: '#f8f9fa' }}>
                    <Typography color="textSecondary">אין לך פניות קודמות עדיין.</Typography>
                </Paper>
            ) : (
                <Box>
                    {tickets.slice(0, 4).map((ticket) => (
                        <Paper 
                            key={ticket.id} 
                            elevation={0}
                            sx={{ 
                                p: 2, 
                                mb: 2, 
                                borderRadius: 3, 
                                border: '1px solid #e0e0e0',
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                transition: '0.2s',
                                '&:hover': { borderColor: '#2c3e50', bgcolor: '#f8f9fa' }
                            }}
                        >
                            <Box>
                                <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
                                    {ticket.subject}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                    {new Date(ticket.created_at).toLocaleDateString()} • {ticket.priority_name}
                                </Typography>
                            </Box>

                            <Box display="flex" alignItems="center" gap={2}>
                                <Chip 
                                    label={ticket.status_name} 
                                    size="small"
                                    color={ticket.status_name === 'Closed' ? 'success' : 'warning'} 
                                    sx={{ fontWeight: 'bold', borderRadius: 2 }}
                                />
                                <IconButton size="small" onClick={() => navigate(`/tickets/${ticket.id}`)}>
                                    <ArrowForwardIosIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </Paper>
                    ))}
                </Box>
            )}
        </Container>
    );
};