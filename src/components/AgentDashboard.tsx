import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import {
  Container, Typography, Grid,
  Box, Button, Chip, Avatar, Paper, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@mui/material";

import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import { selectFilteredTickets } from "../store/ticketSlice";


const AgentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);
  const { statuses } = useAppSelector(state => state.config);


  const myTickets = useAppSelector(selectFilteredTickets);

  const ticketsByStatus = statuses.map(status => {
    const count = myTickets.filter(t => t.status_id === status.id).length;
    return { name: status.name, count, id: status.id };
  });

  const recentTickets = [...myTickets]
    .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
    .slice(0, 5);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary">
            היי, {user?.name}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            זה אזור העבודה האישי שלך. הנה מה שמחכה לך היום:
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          endIcon={<ArrowForwardIcon />}
          onClick={() => navigate('/tickets')}
        >
          התחל לעבוד (מעבר לטיקטים)
        </Button>
      </Box>

      <Grid container spacing={3} mb={5}>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper elevation={3} sx={{ p: 2, display: 'flex', alignItems: 'center', borderRight: '6px solid #1976d2' }}>
            <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1976d2', mr: 2, width: 56, height: 56 }}>
              <AssignmentIndIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h3" fontWeight="bold">{myTickets.length}</Typography>
              <Typography variant="body2" color="textSecondary">סה"כ פניות בטיפולי</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap' }}>
            {ticketsByStatus.map((stat) => (
              <Box key={stat.id} textAlign="center" m={1}>
                <Typography variant="h5" fontWeight="bold" color="textPrimary">
                  {stat.count}
                </Typography>
                <Chip label={stat.name} variant="outlined" size="small" />
              </Box>
            ))}
            {ticketsByStatus.length === 0 && <Typography>אין נתוני סטטוסים להצגה</Typography>}
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FactCheckIcon color="secondary" />
        הפניות האחרונות שלך
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
              <TableCell>נושא</TableCell>
              <TableCell>לקוח</TableCell>
              <TableCell>דחיפות</TableCell>
              <TableCell>סטטוס</TableCell>
              <TableCell>תאריך פתיחה</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentTickets.length > 0 ? (
              recentTickets.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                    {row.id}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{row.subject}</TableCell>
                  <TableCell>{row.created_by_name || 'אורח'}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.priority_name}
                      size="small"
                      color={row.priority_name.includes('High') || row.priority_name.includes('Urgent') ? 'error' : 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip label={row.status_name} size="small" color="primary" />
                  </TableCell>
                  <TableCell>
                    {new Date(row.created_at).toLocaleDateString('he-IL')}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="textSecondary">
                    אין לך פניות פתוחות כרגע. זמן לקפה! ☕
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default AgentDashboard;