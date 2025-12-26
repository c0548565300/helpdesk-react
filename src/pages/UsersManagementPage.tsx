import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUsers } from '../store/userSlice';
import { 
    Container, Typography, Button, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, Chip, Box,
    ToggleButton, ToggleButtonGroup, Card, CardContent, Divider, Avatar
} from '@mui/material';

import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FilterListIcon from '@mui/icons-material/FilterList';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

import { AddUserDialog } from '../components/AddUserDialog'; 

export const UsersManagementPage = () => {
    const dispatch = useAppDispatch();
    const { users } = useAppSelector(state => state.users);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    // 1. State לסינון
    const [filterRole, setFilterRole] = useState('all');

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    // 2. לוגיקת הסינון
    const filteredUsers = users.filter(user => {
        if (filterRole === 'all') return true;
        return user.role === filterRole;
    });

    const handleFilterChange = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
        if (newAlignment !== null) {
            setFilterRole(newAlignment);
        }
    };

const getRoleColor = (role: string): 'error' | 'primary' | 'success' | 'default' => {
    switch(role) {
        case 'admin': return 'error';
        case 'agent': return 'primary';
        case 'customer': return 'success';
        default: return 'default';
    }
};

    const getRoleName = (role: string) => {
        switch(role) {
            case 'admin': return 'מנהל מערכת';
            case 'agent': return 'סוכן תמיכה';
            case 'customer': return 'לקוח';
            default: return role;
        }
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            
         
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Typography variant="h4" fontWeight="800" sx={{ color: '#1a237e', mb: 1 }}>
                        ניהול משתמשים
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        צפייה, סינון וניהול כלל המשתמשים במערכת
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    size="large"
                    startIcon={<PersonAddIcon />} 
                    onClick={() => setIsDialogOpen(true)}
                    sx={{ 
                        borderRadius: 3, 
                        px: 3, 
                        py: 1,
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
                        textTransform: 'none',
                        fontWeight: 'bold'
                    }}
                >
                    הוסף משתמש חדש
                </Button>
            </Box>

            <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #e0e0e0', mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                   
                    <Box display="flex" alignItems="center" flexWrap="wrap" gap={2} mb={3}>
                        <Box display="flex" alignItems="center" gap={1} sx={{ bgcolor: '#f5f7fa', p: 1, px: 2, borderRadius: 2 }}>
                            <FilterListIcon color="action" />
                            <Typography fontWeight="bold" color="textSecondary" variant="body2">סנן לפי תפקיד:</Typography>
                        </Box>
                        
                        <ToggleButtonGroup
                            value={filterRole}
                            exclusive
                            onChange={handleFilterChange}
                            size="small"
                            sx={{ 
                                '& .MuiToggleButton-root': { 
                                    borderRadius: 2, 
                                    mx: 0.5, 
                                    border: '1px solid #e0e0e0',
                                    '&.Mui-selected': {
                                        bgcolor: '#e3f2fd',
                                        color: '#1976d2',
                                        borderColor: '#1976d2',
                                        fontWeight: 'bold'
                                    }
                                } 
                            }}
                        >
                            <ToggleButton value="all" sx={{ px: 3 }}>הכל</ToggleButton>
                            <ToggleButton value="agent" sx={{ px: 2, gap: 1 }}>
                                <SupportAgentIcon fontSize="small" /> סוכנים
                            </ToggleButton>
                            <ToggleButton value="customer" sx={{ px: 2, gap: 1 }}>
                                <PersonIcon fontSize="small" /> לקוחות
                            </ToggleButton>
                            <ToggleButton value="admin" sx={{ px: 2, gap: 1 }}>
                                <AdminPanelSettingsIcon fontSize="small" /> מנהלים
                            </ToggleButton>
                        </ToggleButtonGroup>
                        
                        <Box flexGrow={1} />
                        <Chip label={`סה"כ: ${filteredUsers.length} משתמשים`} variant="outlined" />
                    </Box>

                    <Divider sx={{ mb: 0 }} />

                   
                    <TableContainer sx={{ mt: 1 }}>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', borderBottom: '2px solid #f0f0f0' }}>ID</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', borderBottom: '2px solid #f0f0f0' }}>שם מלא</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', borderBottom: '2px solid #f0f0f0' }}>אימייל</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', borderBottom: '2px solid #f0f0f0' }}>תפקיד</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', borderBottom: '2px solid #f0f0f0' }}>תאריך הצטרפות</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                                            <Box display="flex" flexDirection="column" alignItems="center">
                                                <PersonIcon sx={{ fontSize: 60, color: '#eceff1', mb: 2 }} />
                                                <Typography color="textSecondary">לא נמצאו משתמשים בתצוגה זו</Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <TableRow 
                                            key={user.id} 
                                            hover 
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, transition: '0.2s' }}
                                        >
                                            <TableCell sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>#{user.id}</TableCell>
                                            <TableCell>
                                                <Box display="flex" alignItems="center" gap={1.5}>
                                                    <Avatar sx={{ width: 32, height: 32, bgcolor: getRoleColor(user.role) + '.light', color: getRoleColor(user.role) + '.main', fontSize: '0.875rem' }}>
                                                        {user.name.charAt(0)}
                                                    </Avatar>
                                                    <Typography fontWeight="500">{user.name}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={getRoleName(user.role)} 
                                                    color={getRoleColor(user.role) } 
                                                    size="small" 
                                                    variant="filled" 
                                                    sx={{ 
                                                        fontWeight: 'bold', 
                                                        minWidth: 90,
                                                        bgcolor: (theme) => theme.palette[getRoleColor(user.role) as 'primary' | 'error' | 'success'].light + '20', 
                                                        color: (theme) => theme.palette[getRoleColor(user.role) as 'primary' | 'error' | 'success'].main
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {user.created_at ? new Date(user.created_at).toLocaleDateString('he-IL') : '-'}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            <AddUserDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
        </Container>
    );
};