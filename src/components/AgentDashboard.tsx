import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchTickets } from "../store/ticketSlice";
import { fetchMetadata } from "../store/configSlice";

import {
  Typography,Grid, Card, CardContent,
  Box, Button, Chip, Alert
} from "@mui/material";


import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EventIcon from '@mui/icons-material/Event';

const AgentDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);
  
  const { tickets } = useAppSelector(state => state.ticket);
  const { statuses } = useAppSelector(state => state.config);

  useEffect(() => {
    dispatch(fetchTickets());
    if (statuses.length === 0) dispatch(fetchMetadata());
  }, [dispatch, statuses.length]);

  // זיהוי סטטוס סגור
  const closedStatus = statuses.find(s => 
      s.name.toLowerCase() === 'closed' || 
      s.name.includes('סגור') || 
      s.name.toLowerCase() === 'done'
  );
  const CLOSED_ID = closedStatus ? closedStatus.id : 2;

  // הלוגיקה שלך: רק פתוחים, חדש לישן, רק 6
  const myRecentTasks = tickets
    .filter(t => Number(t.status_id) !== CLOSED_ID)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6);

  // צבע דחיפות
  const getPriorityColor = (name: string) => {
    if (name?.includes('High') || name?.includes('Urgent')) return 'error';
    if (name?.includes('Medium')) return 'warning';
    return 'success';
  };

  return (
    <Box>
      
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
            <Typography variant="h4" fontWeight="800" gutterBottom sx={{ color: '#00695c' }}>
                שלום, {user?.name}
            </Typography>
            <Typography variant="body1" color="textSecondary">
                אזור עבודה אישי - משימות בטיפול
            </Typography>
        </Box>
        <Button 
            variant="contained" 
            endIcon={<ArrowForwardIcon />} 
            onClick={() => navigate('/tickets')}
            sx={{ borderRadius: 2, textTransform: 'none' }}
        >
            לכל הטיקטים
        </Button>
      </Box>

      <Box>
        {myRecentTasks.length === 0 ? (
            <Alert severity="info" variant="outlined" sx={{ borderRadius: 2 }}>
                אין לך משימות פתוחות כרגע.
            </Alert>
        ) : (
            <Grid container spacing={2}>
                {myRecentTasks.map((ticket) => (
                    <Grid size={{ xs: 12, md: 6, lg: 4 }} key={ticket.id}>
                        <Card 
                            elevation={0} 
                            sx={{ 
                                border: '1px solid #e0e0e0', 
                                borderRadius: 3, 
                                height: '100%',
                                transition: '0.2s',
                                '&:hover': { 
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                    borderColor: '#009688'
                                }
                            }}
                        >
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" mb={2}>
                                    <Chip 
                                        label={ticket.priority_name} 
                                        size="small" 
                                        color={getPriorityColor(ticket.priority_name)} 
                                        variant="filled" 
                                    />
                                    <Typography variant="caption" color="textSecondary">#{ticket.id}</Typography>
                                </Box>
                                
                                <Typography 
                                    variant="h6" 
                                    fontWeight="bold" 
                                    gutterBottom
                                    noWrap
                                    title={ticket.subject}
                                    sx={{ color: '#2c3e50' }}
                                >
                                    {ticket.subject}
                                </Typography>
                                
                                <Box display="flex" alignItems="center" gap={1} mb={3}>
                                    <EventIcon fontSize="small" color="action" />
                                    <Typography variant="body2" color="textSecondary">
                                        {new Date(ticket.created_at).toLocaleDateString()}
                                    </Typography>
                                </Box>
                                
                                <Button 
                                    variant="outlined" 
                                    fullWidth 
                                    startIcon={<VisibilityIcon />}
                                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                                    color="primary"
                                    sx={{ borderRadius: 2 }}
                                >
                                    כנס לטיפול
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        )}
      </Box>

       {myRecentTasks.length > 0 && (
            <Box mt={4} textAlign="center">
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    מציג את 6 הפניות האחרונות בלבד
                </Typography>
            </Box>
       )}

    </Box>
  );
};

export default AgentDashboard;