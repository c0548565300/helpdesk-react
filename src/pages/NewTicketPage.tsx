import React, {  useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Stack,
  Dialog, DialogContent, DialogActions, Zoom,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { createTicket } from '../store/ticketSlice';

interface NewTicketFormInputs {
  subject: string;
  description: string;
  priority_id: number;
}

export const NewTicketPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { priorities } = useAppSelector((state) => state.config);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<NewTicketFormInputs>();


  const onSubmit = async (data: NewTicketFormInputs) => {
    try {
      await dispatch(createTicket(data)).unwrap();
      setIsSuccessOpen(true);
    } catch (error) {
      console.error('Failed to create ticket:', error);
      // כאן אפשר להוסיף הודעת שגיאה למשתמש אם רוצים
    }
  };
  const handleSuccessClose = () => {
    setIsSuccessOpen(false);
    navigate('/dashboard'); // רק עכשיו עוברים לדשבורד
  };
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>

        <Box textAlign="center" mb={4}>
          <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
            פתיחת קריאה חדשה
          </Typography>
          <Typography variant="body2" color="textSecondary" mt={1}>
            תאר את הבעיה ונציג יחזור אליך בהקדם
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>

            <Controller
              name="subject"
              control={control}
              defaultValue=""
              rules={{ required: "חובה למלא נושא לפנייה" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="נושא הפנייה"
                  variant="outlined"
                  fullWidth
                  error={!!errors.subject}
                  helperText={errors.subject?.message}
                  placeholder="לדוגמה: המחשב לא נדלק"
                />
              )}
            />

            <Controller
              name="priority_id"
              control={control}
              defaultValue={undefined}
              rules={{ required: "אנא בחר רמת דחיפות" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.priority_id}>
                  <InputLabel id="priority-label">רמת דחיפות</InputLabel>
                  <Select
                    {...field}
                    labelId="priority-label"
                    label="רמת דחיפות"
                  >
                    {priorities.map((priority) => (
                      <MenuItem key={priority.id} value={priority.id}>
                        {priority.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.priority_id?.message}</FormHelperText>
                </FormControl>
              )}
            />

            <Controller
              name="description"
              control={control}
              defaultValue=""
              rules={{
                required: "חובה לפרט את מהות התקלה",
                minLength: { value: 10, message: "נא לפרט לפחות 10 תווים" }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="תיאור מפורט"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  placeholder="מה קרה? מתי זה קרה? האם ניסית לעשות משהו?"
                />
              )}
            />

            <Stack direction="row" spacing={2} justifyContent="space-between" mt={2}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/dashboard')}
                disabled={isSubmitting}
              >
                ביטול
              </Button>

              <Button
                type="submit"
                variant="contained"
                size="large"
                endIcon={<SendIcon />}
                disabled={isSubmitting}
                sx={{ px: 4 }}
              >
                {isSubmitting ? 'שולח...' : 'שלח פנייה'}
              </Button>
            </Stack>

          </Stack>
        </form>
      </Paper>
      {/* --- כאן הפופאפ (Dialog) היפה --- */}
      <Dialog
        open={isSuccessOpen}
        onClose={handleSuccessClose} // סוגר ומנווט גם בלחיצה בחוץ
        TransitionComponent={Zoom} // אפקט אנימציה של זום
        PaperProps={{
          sx: { borderRadius: 3, p: 2, textAlign: 'center', minWidth: 300 }
        }}
      >
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.main' }} />

            <Typography variant="h5" fontWeight="bold">
              הפניה נוצרה בהצלחה!
            </Typography>

            <Typography color="textSecondary">
              קיבלנו את הקריאה שלך, סוכן יטפל בה בהקדם.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            onClick={handleSuccessClose}
            variant="contained"
            size="large"
            autoFocus
            sx={{ minWidth: 150, borderRadius: 4 }}
          >
            מעולה, תודה
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
};