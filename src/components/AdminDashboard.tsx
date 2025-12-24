import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  Container, Typography, Box, Button, Chip, Avatar, Paper, Divider,
  FormControl, InputLabel, Select, MenuItem, Alert, Card, CardContent
} from "@mui/material";
import Grid from '@mui/material/Grid'; 

import AddIcon from '@mui/icons-material/Add';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupIcon from '@mui/icons-material/Group';
import WarningIcon from '@mui/icons-material/Warning';

// ייבוא הפעולות המעודכנות
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

  // 2. לוגיקה לחישוב טיקטים ללא הקצאה
  const unassignedTickets = tickets.filter(t => !t.assigned_to);

  // 3. טעינת נתונים ראשונית אם הם חסרים
  useEffect(() => {
    if (users.length === 0) dispatch(fetchUsers());
    if (tickets.length === 0) dispatch(fetchTickets());
  }, [dispatch, users.length, tickets.length]);

  // 4. עדכון פונקציית ההקצאה לשימוש ב-updateTicket הכללי
  const handleAssign = (ticketId: number, agentId: number) => {
    dispatch(updateTicket({ 
      ticketId, 
      data: { assigned_to: agentId } 
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>

      {/* Header Area */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary">
            שלום, {user?.name}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            מנהל מערכת - לוח בקרה
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            color="secondary"
            onClick={() => setIsStatusDialogOpen(true)}
          >
            ניהול סטטוסים
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            color="secondary"
            onClick={() => setIsPriorityDialogOpen(true)}
          >
            ניהול דחיפויות
          </Button>
          <Button
            variant="contained"
            startIcon={<GroupIcon />}
            onClick={() => navigate('/admin/users')}
          >
            ניהול משתמשים
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={5}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper elevation={3} sx={{ p: 2, display: 'flex', alignItems: 'center', bgcolor: '#fff3e0', borderLeft: '6px solid #ff9800' }}>
            <Avatar sx={{ bgcolor: '#ff9800', mr: 2, width: 56, height: 56 }}>
              <WarningIcon />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold">{unassignedTickets.length}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#e65100' }}>
                ממתינות להקצאה
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper elevation={3} sx={{ p: 2, display: 'flex', alignItems: 'center', borderLeft: '6px solid #1976d2' }}>
            <Avatar sx={{ bgcolor: '#1976d2', mr: 2, width: 56, height: 56 }}>
              <GroupIcon />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold">{agents.length}</Typography>
              <Typography variant="body2" color="textSecondary">סוכנים פעילים</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Button
            variant="contained"
            fullWidth
            color="success"
            sx={{ height: '100%', minHeight: '88px', fontSize: '1.1rem' }}
            onClick={() => navigate('/tickets')}
            endIcon={<AssignmentIcon />}
          >
            כל הטיקטים ({tickets.length})
          </Button>
        </Grid>
      </Grid>

      {/* Assignment Section */}
      <Box mb={2}>
        <Typography variant="h5" fontWeight="bold">פניות חדשות להקצאה</Typography>
        <Typography variant="body2" color="textSecondary">אנא הקצה סוכן לפניות הבאות כדי להתחיל טיפול</Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />

      {unassignedTickets.length === 0 ? (
        <Alert severity="success" variant="filled">מצוין! כל הפניות מטופלות ומוקצות לסוכנים.</Alert>
      ) : (
        <Grid container spacing={2}>
          {unassignedTickets.slice(0, 6).map((ticket) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={ticket.id}>
              <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 2, height: '100%' }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Chip label={ticket.priority_name} size="small" color="error" variant="outlined" />
                    <Typography variant="caption" color="textSecondary">#{ticket.id}</Typography>
                  </Box>
                  <Typography variant="h6" fontWeight="bold" noWrap gutterBottom>
                    {ticket.subject}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" mb={2}>
                    נפתח ע"י: {ticket.created_by_name || 'לקוח'}
                  </Typography>
                  
                  <FormControl fullWidth size="small" sx={{ bgcolor: '#f5f5f5' }}>
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

      {/* Dialogs */}
      <AddStatusDialog open={isStatusDialogOpen} onClose={() => setIsStatusDialogOpen(false)} />
      <AddPriorityDialog open={isPriorityDialogOpen} onClose={() => setIsPriorityDialogOpen(false)} />

    </Container>
  );
}

export default AdminDashboard;