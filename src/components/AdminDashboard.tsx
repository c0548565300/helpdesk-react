import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import Swal from 'sweetalert2';

import {
  Typography, Box, Button, Chip, Avatar,  Divider,
  FormControl, InputLabel, Select, MenuItem, Alert, Card, CardContent,
  Grid
} from "@mui/material";

import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupIcon from '@mui/icons-material/Group';
import WarningIcon from '@mui/icons-material/Warning';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { updateTicket, selectFilteredTickets, fetchTickets } from "../store/ticketSlice";
import { fetchUsers, selectAgents } from "../store/userSlice";
import { AddStatusDialog } from "../components/AddStatusDialog";
import { AddPriorityDialog } from "../components/AddPriorityDialog";

const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const { user } = useAppSelector(state => state.auth);
  const tickets = useAppSelector(selectFilteredTickets);
  const agents = useAppSelector(selectAgents);
  const { users } = useAppSelector(state => state.users);

  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isPriorityDialogOpen, setIsPriorityDialogOpen] = useState(false);

  const unassignedTickets = tickets.filter(t => !t.assigned_to);

  useEffect(() => {
    if (users.length === 0) dispatch(fetchUsers());
    if (tickets.length === 0) dispatch(fetchTickets());
  }, [dispatch, users.length, tickets.length]);

  const handleAssign = (ticketId: number, agentId: number) => {
    dispatch(updateTicket({ 
      ticketId, 
      data: { assigned_to: agentId } 
    }))
    .unwrap()
    .then(() => {
        Swal.fire({
            icon: 'success',
            title: 'הטיקט הוקצה בהצלחה',
            toast: true,
            position: 'bottom-start',
            showConfirmButton: false,
            timer: 2000
        });
    })
    .catch(() => {
        Swal.fire('שגיאה', 'לא ניתן היה לבצע את ההקצאה', 'error');
    });
  };

  const getBorderColor = (priority?: string) => {
      if (priority?.includes('High') || priority?.includes('Urgent')) return '#d32f2f';
      if (priority?.includes('Medium')) return '#ed6c02';
      return '#e0e0e0';
  };

  return (
    <Box>
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
        <Box>
            <Typography variant="h4" fontWeight="800" gutterBottom sx={{ color: '#1a237e' }}>
                שלום, {user?.name}
            </Typography>
            <Typography variant="body1" color="textSecondary">
                מנהל מערכת - לוח בקרה והקצאות
            </Typography>
        </Box>
        
        <Box display="flex" gap={1}>
            <Button variant="outlined" startIcon={<SettingsIcon />} onClick={() => setIsStatusDialogOpen(true)}>
                סטטוסים
            </Button>
            <Button variant="outlined" startIcon={<SettingsIcon />} onClick={() => setIsPriorityDialogOpen(true)}>
                דחיפויות
            </Button>
            <Button variant="contained" startIcon={<GroupIcon />} onClick={() => navigate('/admin/users')} sx={{ borderRadius: 2 }}>
                משתמשים
            </Button>
        </Box>
      </Box>

    
      <Grid container spacing={3} mb={5}>
        
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3, height: '100%' }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                    <Avatar sx={{ bgcolor: '#ffebee', color: '#d32f2f', width: 56, height: 56, mr: 2 }}>
                        <WarningIcon fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight="bold" color="#d32f2f">{unassignedTickets.length}</Typography>
                        <Typography variant="subtitle2" color="textSecondary">ממתינות להקצאה</Typography>
                    </Box>
                </CardContent>
            </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card 
                elevation={0} 
                sx={{ 
                    border: '1px solid #e0e0e0', borderRadius: 3, height: '100%',
                    cursor: 'pointer', 
                    transition: '0.3s',
                    '&:hover': { 
                        bgcolor: '#f5f5f5', 
                        borderColor: '#1976d2',
                        '& .arrow-icon': { 
                            color: '#1976d2',
                            transform: 'translateX(5px)' 
                        }
                    }
                }}
                onClick={() => navigate('/admin/users')}
            >
                <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                    <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1976d2', width: 56, height: 56, mr: 2 }}>
                        <GroupIcon fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight="bold" color="#1976d2">{agents.length}</Typography>
                        <Typography variant="subtitle2" color="textSecondary">סוכנים פעילים</Typography>
                    </Box>
                    <ArrowForwardIcon className="arrow-icon" sx={{ ml: 'auto', color: '#ccc', transition: '0.3s' }} />
                </CardContent>
            </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card 
                elevation={0} 
                sx={{ 
                    border: '1px solid #e0e0e0', borderRadius: 3, height: '100%', 
                    cursor: 'pointer', 
                    transition: '0.3s',
                    '&:hover': { 
                        bgcolor: '#f5f5f5', 
                        borderColor: '#2e7d32',
                        '& .arrow-icon': { 
                            color: '#2e7d32',
                            transform: 'translateX(5px)'
                        }
                    }
                }}
                onClick={() => navigate('/tickets')}
            >
                <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                    <Avatar sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', width: 56, height: 56, mr: 2 }}>
                        <AssignmentIcon fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight="bold" color="#2e7d32">{tickets.length}</Typography>
                        <Typography variant="subtitle2" color="textSecondary">סה"כ במערכת</Typography>
                    </Box>
                    <ArrowForwardIcon className="arrow-icon" sx={{ ml: 'auto', color: '#ccc', transition: '0.3s' }} />
                </CardContent>
            </Card>
        </Grid>
      </Grid>

      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <AssignmentIcon color="error" />
        <Typography variant="h6" fontWeight="bold">פניות חדשות להקצאה</Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />

      {unassignedTickets.length === 0 ? (
        <Alert severity="success" variant="outlined" sx={{ borderRadius: 2, bgcolor: '#e8f5e9' }} icon={<CheckCircleIcon fontSize="inherit" />}>
            מצוין! כל הפניות מטופלות ומוקצות לסוכנים.
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {unassignedTickets.slice(0, 6).map((ticket) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={ticket.id}>
              <Card 
                elevation={0} 
                sx={{ 
                    border: '1px solid',
                    borderColor: getBorderColor(ticket.priority_name),
                    borderRadius: 3, 
                    height: '100%',
                    transition: '0.2s',
                    '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Chip 
                        label={ticket.priority_name} 
                        size="small" 
                        color={ticket.priority_name?.includes('High') ? 'error' : 'default'} 
                        variant="filled" 
                    />
                    <Typography 
                        variant="caption" 
                        color="textSecondary" 
                        sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                        onClick={() => navigate(`/tickets/${ticket.id}`)}
                    >
                        #{ticket.id}
                    </Typography>
                  </Box>

                  <Typography 
                    variant="h6" 
                    fontWeight="bold" 
                    noWrap 
                    gutterBottom 
                    title={ticket.subject}
                    sx={{ cursor: 'pointer', color: '#1a237e' }}
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                  >
                    {ticket.subject}
                  </Typography>

                  <Box display="flex" alignItems="center" gap={1} mb={3}>
                    <PersonIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="textSecondary">
                       {ticket.created_by_name || 'לקוח לא ידוע'}
                    </Typography>
                  </Box>
                  
                  <FormControl fullWidth size="small" variant="outlined">
                    <InputLabel>בחר סוכן מטפל</InputLabel>
                    <Select
                      label="בחר סוכן מטפל"
                      value={ticket.assigned_to || ""}
                      onChange={(e) => handleAssign(ticket.id, Number(e.target.value))}
                    >
                      <MenuItem value=""><em>-- בחר סוכן --</em></MenuItem>
                      {agents.map(agent => (
                        <MenuItem key={agent.id} value={agent.id}>{agent.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <AddStatusDialog open={isStatusDialogOpen} onClose={() => setIsStatusDialogOpen(false)} />
      <AddPriorityDialog open={isPriorityDialogOpen} onClose={() => setIsPriorityDialogOpen(false)} />

    </Box>
  );
}

export default AdminDashboard;