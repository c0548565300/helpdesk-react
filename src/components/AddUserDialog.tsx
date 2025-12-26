import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Button, TextField, MenuItem, Select, FormControl, InputLabel, FormHelperText 
} from '@mui/material';
import { useAppDispatch } from '../store/hooks';
import { addUser } from '../store/userSlice';
import type { CreateUserPayload } from '../types/models';

interface AddUserDialogProps {
    open: boolean;
    onClose: () => void;
}

export const AddUserDialog: React.FC<AddUserDialogProps> = ({ open, onClose }) => {
    const dispatch = useAppDispatch();
    const { control, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm<CreateUserPayload>();

    const onSubmit = async (data: CreateUserPayload) => {
        try {
            await dispatch(addUser(data)).unwrap();
            reset();
            onClose();
        } catch (errorMessage: any) {
             if (typeof errorMessage === 'string' && errorMessage.includes('Email')) {
                setError('email', { type: 'manual', message: 'כתובת האימייל הזו כבר קיימת' });
            } else {
                alert("שגיאה: " + errorMessage);
            }
        }
    };
    
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3 } }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>הוספת משתמש חדש</DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <Controller
                        name="name"
                        control={control}
                        rules={{ required: "שדה חובה" }}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField {...field} label="שם מלא" fullWidth margin="normal" variant="outlined" error={!!errors.name} helperText={errors.name?.message as string} InputProps={{ sx: { borderRadius: 2 } }} />
                        )}
                    />
                    <Controller
                        name="email"
                        control={control}
                        rules={{ required: "שדה חובה", pattern: { value: /^\S+@\S+$/i, message: "אימייל לא תקין" } }}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField {...field} label="אימייל" fullWidth margin="normal" error={!!errors.email} helperText={errors.email?.message as string} InputProps={{ sx: { borderRadius: 2 } }} />
                        )}
                    />
                    <Controller
                        name="password"
                        control={control}
                        rules={{ required: "שדה חובה", minLength: { value: 6, message: "מינימום 6 תווים" } }}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField {...field} label="סיסמה ראשונית" type="password" fullWidth margin="normal" error={!!errors.password} helperText={errors.password?.message as string} InputProps={{ sx: { borderRadius: 2 } }} />
                        )}
                    />
                    <Controller
                        name="role"
                        control={control}
                        rules={{ required: "חובה לבחור תפקיד" }}
                        defaultValue={undefined}
                        render={({ field }) => (
                            <FormControl fullWidth margin="normal" error={!!errors.role}>
                                <InputLabel>תפקיד במערכת</InputLabel>
                                <Select {...field} label="תפקיד במערכת" sx={{ borderRadius: 2 }}>
                                    <MenuItem value="customer">לקוח (Customer)</MenuItem>
                                    <MenuItem value="agent">סoכן (Agent)</MenuItem>
                                    <MenuItem value="admin">מנהל (Admin)</MenuItem>
                                </Select>
                                <FormHelperText>{errors.role?.message as string}</FormHelperText>
                            </FormControl>
                        )}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
                    <Button onClick={onClose} color="inherit" sx={{ fontWeight: 'bold' }}>ביטול</Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ borderRadius: 2, px: 3 }}>צור משתמש</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};