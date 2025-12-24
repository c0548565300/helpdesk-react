import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Button, TextField, MenuItem, Select, FormControl, InputLabel, FormHelperText 
} from '@mui/material';
import { useAppDispatch } from '../store/hooks';
import { addUser } from '../store/userSlice';

interface AddUserDialogProps {
    open: boolean;
    onClose: () => void;
}

export const AddUserDialog: React.FC<AddUserDialogProps> = ({ open, onClose }) => {
    const dispatch = useAppDispatch();
    const { control, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data: any) => {
        try {
            await dispatch(addUser(data)).unwrap();
            
            reset();
            onClose();
        } catch (errorMessage: any) {
            console.error("Failed to add user:", errorMessage);

            if (typeof errorMessage === 'string' && 
               (errorMessage.includes('Email') || errorMessage.includes('taken') || errorMessage.includes('Conflict'))) {
                
                setError('email', {
                    type: 'manual',
                    message: 'כתובת האימייל הזו כבר קיימת במערכת' 
                });
            } else {
                alert("אירעה שגיאה: " + errorMessage);
            }
        }
    };
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>הוספת משתמש חדש למערכת</DialogTitle>
                <DialogContent>
                    
                    <Controller
                        name="name"
                        control={control}
                        rules={{ required: "שדה חובה" }}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField {...field} label="שם מלא" fullWidth margin="normal" error={!!errors.name} helperText={errors.name?.message as string} />
                        )}
                    />

                    <Controller
                        name="email"
                        control={control}
                        rules={{ required: "שדה חובה", pattern: { value: /^\S+@\S+$/i, message: "אימייל לא תקין" } }}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField {...field} label="אימייל" fullWidth margin="normal" error={!!errors.email} helperText={errors.email?.message as string} />
                        )}
                    />

                    <Controller
                        name="password"
                        control={control}
                        rules={{ required: "שדה חובה", minLength: { value: 6, message: "מינימום 6 תווים" } }}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField {...field} label="סיסמה ראשונית" type="password" fullWidth margin="normal" error={!!errors.password} helperText={errors.password?.message as string} />
                        )}
                    />

                    <Controller
                        name="role"
                        control={control}
                        rules={{ required: "חובה לבחור תפקיד" }}
                        defaultValue=""
                        render={({ field }) => (
                            <FormControl fullWidth margin="normal" error={!!errors.role}>
                                <InputLabel>תפקיד במערכת</InputLabel>
                                <Select {...field} label="תפקיד במערכת">
                                    <MenuItem value="customer">לקוח (Customer)</MenuItem>
                                    <MenuItem value="agent">סוכן (Agent)</MenuItem>
                                    <MenuItem value="admin">מנהל (Admin)</MenuItem>
                                </Select>
                                <FormHelperText>{errors.role?.message as string}</FormHelperText>
                            </FormControl>
                        )}
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>ביטול</Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>צור משתמש</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};