import React from 'react';
import { useForm, Controller,type SubmitHandler } from 'react-hook-form';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Button, TextField 
} from '@mui/material';
import { useAppDispatch } from '../store/hooks';
import { addStatus } from '../store/configSlice';

interface AddStatusDialogProps {
    open: boolean;
    onClose: () => void;
}

interface StatusFormInputs {
    name: string;
}

export const AddStatusDialog: React.FC<AddStatusDialogProps> = ({ open, onClose }) => {
    const dispatch = useAppDispatch();

    const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<StatusFormInputs>();

    const onSubmit: SubmitHandler<StatusFormInputs> = async (data) => {
        try {
            await dispatch(addStatus(data.name)).unwrap();
            reset();
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            fullWidth 
            maxWidth="xs" 
            PaperProps={{ sx: { borderRadius: 3 } }}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>
                    הוספת סטטוס חדש
                </DialogTitle>
                
                <DialogContent sx={{ pt: 3 }}>
                    <Controller
                        name="name"
                        control={control}
                        rules={{ required: "שדה חובה" }}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField 
                                {...field} 
                                label="שם הסטטוס" 
                                fullWidth 
                                margin="normal" 
                                variant="outlined" 
                                error={!!errors.name} 
                                helperText={errors.name?.message}
                                InputProps={{ sx: { borderRadius: 2 } }} 
                            />
                        )}
                    />
                </DialogContent>
                
                <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
                    <Button onClick={onClose} color="inherit" sx={{ fontWeight: 'bold' }}>
                        ביטול
                    </Button>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        disabled={isSubmitting} 
                        sx={{ borderRadius: 2, px: 3 }}
                    >
                        שמור
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};