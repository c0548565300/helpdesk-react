import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Button, TextField, DialogContentText 
} from '@mui/material';
import { useAppDispatch } from '../store/hooks';
import { addPriority } from '../store/configSlice'; 

interface AddPriorityDialogProps {
    open: boolean;
    onClose: () => void;
}

interface FormInputs {
    name: string;
}

export const AddPriorityDialog: React.FC<AddPriorityDialogProps> = ({ open, onClose }) => {
    const dispatch = useAppDispatch();
    
    const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormInputs>();

    const onSubmit = async (data: FormInputs) => {
        try {
            // שליחת הפעולה ל-Redux
            await dispatch(addPriority(data.name)).unwrap();
            
            reset();
            onClose();
        } catch (error) {
            console.error("Failed to add priority:", error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>הוספת רמת דחיפות</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        הכנס שם לרמת דחיפות חדשה (למשל: "דחוף מאוד", "קריטי").
                    </DialogContentText>
                    
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
                                label="שם הדחיפות"
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
                    <Button type="submit" variant="contained" color="secondary" disabled={isSubmitting}>
                        {isSubmitting ? "שומר..." : "שמור דחיפות"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};