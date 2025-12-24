import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUsers } from '../store/userSlice';
import { 
    Container, Typography, Button, Paper, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, Chip, Box 
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { AddUserDialog } from '../components/AddUserDialog'; 

export const UsersManagementPage = () => {
    const dispatch = useAppDispatch();
    const { users, loading } = useAppSelector(state => state.users);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    // פונקציית עזר לצבעים של תפקידים
    const getRoleColor = (role: string) => {
        switch(role) {
            case 'admin': return 'error';
            case 'agent': return 'primary';
            default: return 'default';
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold">ניהול משתמשים</Typography>
                <Button 
                    variant="contained" 
                    startIcon={<PersonAddIcon />} 
                    onClick={() => setIsDialogOpen(true)}
                >
                    הוסף משתמש חדש
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                            <TableCell>שם</TableCell>
                            <TableCell>אימייל</TableCell>
                            <TableCell>תפקיד</TableCell>
                            <TableCell>תאריך הצטרפות</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={user.role} 
                                        color={getRoleColor(user.role) as any} 
                                        size="small" 
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>
                                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* הדיאלוג מוחבא כאן ונפתח בלחיצה */}
            <AddUserDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
        </Container>
    );
};