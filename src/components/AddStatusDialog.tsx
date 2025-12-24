import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Button, TextField, DialogContentText 
} from '@mui/material';
import { useAppDispatch } from '../store/hooks';
import { addStatus } from '../store/configSlice'; // ודאי שיצרת את הפעולה הזו

interface AddStatusDialogProps {
    open: boolean;
    onClose: () => void;
}

interface FormInputs {
    name: string;
}

export const AddStatusDialog: React.FC<AddStatusDialogProps> = ({ open, onClose }) => {
    const dispatch = useAppDispatch();
    
    const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormInputs>();

    const onSubmit = async (data: FormInputs) => {
        try {
            await dispatch(addStatus(data.name)).unwrap();        
            reset();
            onClose();
        } catch (error) {
            console.error("Failed to add status:", error);
            // כאן אפשר להוסיף הודעת שגיאה למשתמש (setError)
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>הוספת סטטוס חדש</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        הכנס את שם הסטטוס החדש שברצונך להוסיף למערכת.
                    </DialogContentText>
                    
                    {/* 3. הגשר בין MUI ל-React Hook Form */}
                    <Controller
                        name="name"
                        control={control}
                        defaultValue=""
                        rules={{ 
                            required: "שדה זה הוא חובה",
                            minLength: { value: 2, message: "מינימום 2 תווים" }
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field} 
                                autoFocus
                                margin="dense"
                                label="שם הסטטוס"
                                type="text"
                                fullWidth
                                variant="outlined"
                                error={!!errors.name} 
                                helperText={errors.name?.message} 
                            />
                        )}
                    />
                </DialogContent>
                
                <DialogActions>
                    <Button onClick={onClose} color="inherit">ביטול</Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                        {isSubmitting ? "שומר..." : "שמור סטטוס"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};