import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchTickets, selectFilteredTickets, updateTicket } from "../store/ticketSlice";
import { fetchMetadata } from "../store/configSlice";
import { fetchUsers, selectAgents } from "../store/userSlice"; 
import Swal from 'sweetalert2';

import {
  Container, Typography, Box, Button, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, IconButton, Tooltip, InputAdornment, Avatar, 
  FormControl, Select, MenuItem, Grid, type SelectChangeEvent,
  InputLabel, Card, Fade
} from "@mui/material";

import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import TuneIcon from '@mui/icons-material/Tune';

export const TicketsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const tickets = useAppSelector(selectFilteredTickets);
  const { user } = useAppSelector(state => state.auth);
  const { statuses, priorities } = useAppSelector(state => state.config);
  const agents = useAppSelector(selectAgents);
  const { users } = useAppSelector(state => state.users);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(""); 
  const [priorityFilter, setPriorityFilter] = useState<string>(""); 

  useEffect(() => {
    dispatch(fetchTickets());
    if (statuses.length === 0) dispatch(fetchMetadata());

    if (user?.role === 'admin' && users.length === 0) {
        dispatch(fetchUsers());
    }
  }, [dispatch, statuses.length, users.length, user?.role]);

  const displayedTickets = tickets.filter(ticket => {
    const matchesSearch = 
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id.toString().includes(searchTerm);

    const matchesStatus = statusFilter ? Number(ticket.status_id) === Number(statusFilter) : true;
    const matchesPriority = priorityFilter ? ticket.priority_id === Number(priorityFilter) : true;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const clearFilters = () => {
      setSearchTerm("");
      setStatusFilter("");
      setPriorityFilter("");
  };

  const getPriorityColor = (priority?: string | null) => {
    if (priority?.includes('High') || priority?.includes('Urgent')) return 'error';
    if (priority?.includes('Medium')) return 'warning';
    return 'success';
  };

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

  return (
    <Box sx={{ bgcolor: '#f4f7fc', minHeight: '100vh', py: 5 }} dir="rtl">
        <Container maxWidth="xl">
        
        <Fade in timeout={800}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={5} flexWrap="wrap" gap={2}>
                <Box>
                    <Typography 
                        variant="h3" 
                        fontWeight="900" 
                        sx={{ 
                            background: 'linear-gradient(135deg, #0d47a1 0%, #42a5f5 100%)', 
                            WebkitBackgroundClip: 'text', 
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '-1px'
                        }} 
                        gutterBottom
                    >
                        ניהול פניות
                    </Typography>
                    <Typography variant="body1" color="textSecondary" sx={{ fontWeight: 500, fontSize: '1.1rem' }}>
                        מציג {displayedTickets.length} פניות פעילות במערכת
                    </Typography>
                </Box>
                
                {user?.role === 'customer' && (
                    <Button 
                        variant="contained" 
                        size="large" 
                        startIcon={<AddIcon sx={{ ml: 1 }} />} 
                        onClick={() => navigate('/tickets/new')}
                        sx={{ 
                            borderRadius: '12px', 
                            px: 4, py: 1.5, 
                            fontWeight: 'bold',
                            textTransform: 'none',
                            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                            boxShadow: '0 8px 20px rgba(25, 118, 210, 0.3)',
                            transition: '0.3s',
                            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 25px rgba(25, 118, 210, 0.4)' }
                        }}
                    >
                        פתיחת פניה חדשה
                    </Button>
                )}
            </Box>
        </Fade>

        <Card elevation={0} sx={{ 
            p: 3, mb: 4, borderRadius: 4, 
            border: '1px solid rgba(255,255,255,0.8)', 
            bgcolor: '#ffffff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)' 
        }}>
            <Box display="flex" alignItems="center" gap={1} mb={3} color="primary.main">
                <TuneIcon fontSize="small" />
                <Typography variant="subtitle2" fontWeight="bold" sx={{ letterSpacing: 0.5 }}>סינון וחיפוש הפניות</Typography>
            </Box>
            
            <Grid container spacing={3} alignItems="center">
                <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                        variant="outlined"
                        placeholder="חיפוש לפי נושא או מספר..."
                        fullWidth
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                bgcolor: '#f8f9fa',
                                transition: '0.3s',
                                '& fieldset': { borderColor: 'transparent' },
                                '&:hover fieldset': { borderColor: '#e3f2fd' },
                                '&.Mui-focused fieldset': { borderColor: '#2196f3', boxShadow: '0 0 0 4px rgba(33, 150, 243, 0.1)' },
                                '& input': { textAlign: 'right' }
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start" sx={{ ml: 1 }}> 
                                    <SearchIcon color="primary" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FormControl fullWidth size="medium">
                        <InputLabel 
                            id="status-label" 
                            sx={{ transformOrigin: 'top right', right: 25, left: 'auto', '&.Mui-focused': { color: '#1976d2' } }}
                        >
                            סינון לפי סטטוס
                        </InputLabel>
                        <Select 
                            labelId="status-label"
                            value={statusFilter} 
                            label="סינון לפי סטטוס" 
                            onChange={(e) => setStatusFilter(e.target.value)}
                            sx={{ 
                                borderRadius: 3, 
                                textAlign: 'right', 
                                bgcolor: '#f8f9fa',
                                '& .MuiSelect-icon': { left: 10, right: 'auto' },
                                '& fieldset': { borderColor: 'transparent' }
                            }}
                        >
                            <MenuItem value="" sx={{ justifyContent: 'flex-end' }}><em>הכל</em></MenuItem>
                            {statuses.map(status => <MenuItem key={status.id} value={status.id} sx={{ justifyContent: 'flex-end' }}>{status.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FormControl fullWidth size="medium">
                        <InputLabel 
                            id="priority-label" 
                            sx={{ transformOrigin: 'top right', right: 25, left: 'auto', '&.Mui-focused': { color: '#1976d2' } }}
                        >
                            סינון לפי דחיפות
                        </InputLabel>
                        <Select 
                            labelId="priority-label"
                            value={priorityFilter} 
                            label="סינון לפי דחיפות" 
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            sx={{ 
                                borderRadius: 3, 
                                textAlign: 'right', 
                                bgcolor: '#f8f9fa',
                                '& .MuiSelect-icon': { left: 10, right: 'auto' },
                                '& fieldset': { borderColor: 'transparent' }
                            }}
                        >
                            <MenuItem value="" sx={{ justifyContent: 'flex-end' }}><em>הכל</em></MenuItem>
                            {priorities.map(priority => <MenuItem key={priority.id} value={priority.id} sx={{ justifyContent: 'flex-end' }}>{priority.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 2 }} display="flex" justifyContent="flex-end">
                    <Fade in={!!(searchTerm || statusFilter || priorityFilter)}>
                        <Button 
                            variant="outlined" 
                            color="error" 
                            startIcon={<FilterListOffIcon sx={{ ml: 1 }} />} 
                            onClick={clearFilters}
                            sx={{ borderRadius: 3, fontWeight: 'bold', border: '1px solid #ffcdd2', bgcolor: '#ffebee' }}
                        >
                            נקה
                        </Button>
                    </Fade>
                </Grid>
            </Grid>
        </Card>

        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 25px rgba(0,0,0,0.05)' }}>
            <Table sx={{ minWidth: 700 }} aria-label="tickets table">
            <TableHead>
                <TableRow sx={{ bgcolor: '#f1f5f9' }}>
                    {['#', 'נושא הפניה', 'סטטוס', 'דחיפות', user?.role === 'admin' ? 'הקצאה מהירה' : 'מוקצה ל', 'נוצר ע"י', 'תאריך', 'פעולות'].map((header) => (
                        <TableCell key={header} align="right" sx={{ color: '#475569', fontWeight: '800', borderBottom: '2px solid #e2e8f0', py: 2 }}>
                            {header}
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {displayedTickets.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                            <Box display="flex" flexDirection="column" alignItems="center" gap={2} color="text.secondary">
                                <SearchIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                                <Typography variant="h6">לא נמצאו פניות תואמות</Typography>
                                <Typography variant="body2">נסה לשנות את מסנני החיפוש</Typography>
                            </Box>
                        </TableCell>
                    </TableRow>
                ) : (
                    displayedTickets.map((ticket) => {
                        
                        const assignedAgentObj = users.find(u => u.id === ticket.assigned_to);
                        const creatorObj = users.find(u => u.id === ticket.created_by);

                        let displayAgent = 'טרם הוקצה';
                        if (ticket.assigned_to) {
                            if (assignedAgentObj) displayAgent = assignedAgentObj.name;
                            else if (ticket.assigned_to_name) displayAgent = ticket.assigned_to_name;
                            else displayAgent = `סוכן #${ticket.assigned_to}`; 
                        }

                        let displayCreator = 'לא ידוע';
                        if (ticket.created_by) {
                            if (creatorObj) displayCreator = creatorObj.name;
                            else if (ticket.created_by_name) displayCreator = ticket.created_by_name;
                            else displayCreator = `משתמש #${ticket.created_by}`;
                        }

                        return (
                            <TableRow 
                                key={ticket.id} 
                                hover 
                                sx={{ 
                                    cursor: 'pointer', 
                                    transition: 'all 0.2s ease', 
                                    '&:hover': { bgcolor: '#f8fafc', transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
                                    borderBottom: '1px solid #f1f5f9'
                                }}
                                onClick={() => navigate(`/tickets/${ticket.id}`)}
                            >
                                <TableCell align="right" component="th" scope="row" sx={{ fontFamily: 'monospace', color: '#64748b', fontWeight: 'bold' }}>
                                    #{ticket.id}
                                </TableCell>
                                
                                <TableCell align="right" sx={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>
                                    {ticket.subject}
                                </TableCell>
                                
                                <TableCell align="right">
                                    <Chip 
                                        label={ticket.status_name} 
                                        size="small" 
                                        variant={ticket.status_name?.includes('Close') ? 'outlined' : 'filled'}
                                        color={ticket.status_name?.includes('Close') ? 'default' : 'primary'}
                                        sx={{ fontWeight: '700', borderRadius: '8px', px: 1 }}
                                    />
                                </TableCell>
                                
                                <TableCell align="right">
                                    <Chip 
                                        label={ticket.priority_name} 
                                        size="small" 
                                        color={getPriorityColor(ticket.priority_name)}
                                        sx={{ fontWeight: '700', minWidth: '80px', borderRadius: '8px' }}
                                    />
                                </TableCell>
                                
                                <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                                    {user?.role === 'admin' ? (
                                        <FormControl fullWidth size="small" variant="standard">
                                            <Select
                                                value={ticket.assigned_to || ""}
                                                displayEmpty
                                                onChange={(e: SelectChangeEvent<string | number>) => handleAssign(ticket.id, Number(e.target.value))}
                                                disableUnderline
                                                sx={{ 
                                                    fontSize: '0.875rem', 
                                                    bgcolor: '#f1f5f9', 
                                                    borderRadius: 2, 
                                                    px: 1, 
                                                    textAlign: 'right',
                                                    '& .MuiSelect-icon': { left: 0, right: 'auto' },
                                                    '&:hover': { bgcolor: '#e2e8f0' }
                                                }}
                                            >
                                                <MenuItem value="" sx={{ justifyContent: 'flex-end' }}><em>-- ללא --</em></MenuItem>
                                                {agents.map(agent => (
                                                    <MenuItem key={agent.id} value={agent.id} sx={{ justifyContent: 'flex-end' }}>{agent.name}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    ) : (
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Avatar sx={{ width: 26, height: 26, fontSize: '0.7rem', bgcolor: '#e0f2f1', color: '#00695c' }}>
                                                {displayAgent[0]}
                                            </Avatar>
                                            <Typography variant="body2" fontWeight="500">{displayAgent}</Typography>
                                        </Box>
                                    )}
                                </TableCell>

                                <TableCell align="right">
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Avatar sx={{ width: 26, height: 26, fontSize: '0.7rem', bgcolor: '#f5f5f5', color: '#616161' }}>
                                            {displayCreator[0]}
                                        </Avatar>
                                        <Typography variant="body2" color="text.secondary">{displayCreator}</Typography>
                                    </Box>
                                </TableCell>
                                
                                <TableCell align="right" sx={{ color: '#64748b' }}>{new Date(ticket.created_at).toLocaleDateString()}</TableCell>
                                
                                <TableCell align="center">
                                    <Tooltip title="צפה בפרטים">
                                        <IconButton size="small" sx={{ color: '#3b82f6', bgcolor: '#eff6ff', '&:hover': { bgcolor: '#dbeafe' } }}>
                                            <VisibilityIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        );
                    })
                )}
            </TableBody>
            </Table>
        </TableContainer>
        </Container>
    </Box>
  );
};

export default TicketsPage;