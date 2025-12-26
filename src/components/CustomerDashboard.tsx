import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchTickets } from "../store/ticketSlice";

import {
    Typography, Grid, Card, CardContent,
    Box, Button, Chip, Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Divider, CircularProgress
} from "@mui/material";

import AddIcon from '@mui/icons-material/Add';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArticleIcon from '@mui/icons-material/Article';


export const CustomerDashboard: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { user } = useAppSelector(state => state.auth);

    const { tickets, loading } = useAppSelector(state => state.ticket);

    useEffect(() => {
        dispatch(fetchTickets());
    }, [dispatch]);

    const myTickets = tickets.filter(t => t.created_by === user?.id);

    const openTicketsCount = myTickets.filter(t =>
        !t.status_name?.toLowerCase().includes('close') &&
        !t.status_name?.includes('סגור')
    ).length;

    const closedTicketsCount = myTickets.filter(t =>
        t.status_name?.toLowerCase().includes('close') ||
        t.status_name?.includes('סגור')
    ).length;

    if (loading && myTickets.length === 0) {
        return <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>;
    }

    return (
        <Box dir="rtl" sx={{ width: '100%', direction: 'rtl' }}>

            <Box mb={4} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h4" fontWeight="800" gutterBottom sx={{ color: '#1a237e' }}>
                        שלום, {user?.name}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        ברוך הבא למרכז השירות. כאן תוכל לעקוב אחר הפניות שלך.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/tickets/new')}
                    sx={{
                        borderRadius: 2, px: 4, py: 1.5, fontWeight: 'bold', fontSize: '1rem',
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                    }}
                >
                    פתיחת קריאה חדשה
                </Button>
            </Box>

            <Grid container spacing={3} mb={5}>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Card
                        elevation={0}
                        onClick={() => navigate('/tickets')}
                        sx={{
                            border: '1px solid #e0e0e0',
                            borderRadius: 3,
                            height: '100%',
                            cursor: 'pointer',
                            transition: '0.2s',
                            '&:hover': {
                                bgcolor: '#f5faff',
                                borderColor: '#1976d2',
                                transform: 'translateY(-2px)'
                            }
                        }}
                    >
                        <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                            <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1976d2', width: 56, height: 56, ml: 2 }}>
                                <ConfirmationNumberIcon fontSize="large" />
                            </Avatar>
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="h4" fontWeight="bold" color="#1976d2">{closedTicketsCount}</Typography>
                                <Typography variant="subtitle2" color="textSecondary">סה"כ פניות סגורות</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Card
                        elevation={0}
                        onClick={() => navigate('/tickets')}
                        sx={{
                            border: '1px solid #e0e0e0',
                            borderRadius: 3,
                            height: '100%',
                            cursor: 'pointer',
                            transition: '0.2s',
                            '&:hover': {
                                bgcolor: '#fff8f0',
                                borderColor: '#ed6c02',
                                transform: 'translateY(-2px)'
                            }
                        }}
                    >
                        <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                            <Avatar sx={{ bgcolor: '#fff3e0', color: '#ed6c02', width: 56, height: 56, ml: 2 }}>
                                <PendingActionsIcon fontSize="large" />
                            </Avatar>
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="h4" fontWeight="bold" color="#ed6c02">{openTicketsCount}</Typography>
                                <Typography variant="subtitle2" color="textSecondary">פניות פתוחות בטיפול</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Card elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
                <Box p={3} pb={2} display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap={1}>
                        <ArticleIcon color="action" />
                        <Typography variant="h6" fontWeight="bold">פניות אחרונות</Typography>
                    </Box>
                    <Button
                        endIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/tickets')}
                        sx={{ fontWeight: 'bold' }}
                    >
                        לכל הפניות
                    </Button>
                </Box>
                <Divider />

                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                            <TableRow>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>נושא</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>תאריך</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>סטטוס</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>פעולות</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {myTickets.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                        <Typography color="textSecondary">לא נמצאו פניות להצגה</Typography>
                                        <Button variant="text" onClick={() => navigate('/tickets/new')} sx={{ mt: 1 }}>
                                            פתח פניה ראשונה
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                myTickets.slice(0, 5).map((ticket) => (
                                    <TableRow
                                        key={ticket.id}
                                        hover
                                        onClick={() => navigate(`/tickets/${ticket.id}`)}
                                        sx={{
                                            cursor: 'pointer',
                                            transition: '0.2s',
                                            '&:hover': { bgcolor: '#f1f8e9' }
                                        }}
                                    >
                                        <TableCell align="right" sx={{ fontWeight: 500 }}>{ticket.subject}</TableCell>
                                        <TableCell align="right">{new Date(ticket.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell align="right">
                                            <Chip
                                                label={ticket.status_name}
                                                size="small"
                                                color={
                                                    ticket.status_name?.toLowerCase().includes('close') ||
                                                        ticket.status_name?.includes('סגור')
                                                        ? 'default' : 'warning'
                                                }
                                                variant="filled"
                                                sx={{ fontWeight: 'bold', minWidth: 80 }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                sx={{ bgcolor: '#e3f2fd' }}
                                            >
                                                <ArrowBackIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Box>
    );
};