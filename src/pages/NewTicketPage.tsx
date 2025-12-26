import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { createTicket } from "../store/ticketSlice";
import { fetchMetadata } from "../store/configSlice";
import Swal from 'sweetalert2';

// MUI Imports
import {
  Container, Typography, Box, TextField, Button, Paper,
  MenuItem, CircularProgress, InputAdornment, Divider, Alert,
  Grid
} from "@mui/material";

// Icons
import SendIcon from '@mui/icons-material/Send';
import SubjectIcon from '@mui/icons-material/Subject';
import DescriptionIcon from '@mui/icons-material/Description';
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; // חץ ימינה (לחזור אחורה בעברית)

export const NewTicketPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const { loading, error } = useAppSelector((state) => state.ticket);
  const { priorities } = useAppSelector((state) => state.config);

  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    priority_id: ""
  });

  const [errors, setErrors] = useState<{ subject?: string; description?: string; priority_id?: string }>({});

  useEffect(() => {
    dispatch(fetchMetadata());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    let isValid = true;

    if (!formData.subject.trim()) {
      newErrors.subject = 'נא להזין נושא לפניה';
      isValid = false;
    }
    if (!formData.priority_id) {
      newErrors.priority_id = 'יש לבחור רמת דחיפות';
      isValid = false;
    }
    if (!formData.description.trim()) {
      newErrors.description = 'נא לפרט את מהות התקלה';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await dispatch(createTicket({
        subject: formData.subject,
        description: formData.description,
        priority_id: Number(formData.priority_id)
      })).unwrap();

      Swal.fire({
        icon: 'success',
        title: 'הפניה נפתחה בהצלחה!',
        text: 'מספר פניה חדש נוצר במערכת. נציג יטפל בה בהקדם.',
        confirmButtonText: 'חזרה ללוח הבקרה',
        confirmButtonColor: '#2e7d32',
        // --- התיקון לעברית ---
        customClass: {
            popup: 'swal-rtl' // אפשרות להוסיף קלאס אם רוצים
        },
        didOpen: (popup) => {
            popup.style.direction = 'rtl'; 
            popup.style.textAlign = 'center'; 
            popup.style.fontFamily = 'inherit'; 
        }
        
      }).then(() => {
        navigate("/dashboard");
      });

    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'שגיאה בשליחה',
        text: 'לא הצלחנו לפתוח את הפניה. נסה שוב מאוחר יותר.',
        confirmButtonColor: '#d32f2f',
        // גם כאן נוסיף את התיקון כדי שיהיה אחיד
        didOpen: (popup) => {
            popup.style.direction = 'rtl';
            popup.style.fontFamily = 'inherit';
        }
      });
    }
  };
  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }} dir="rtl">
      
      {/* כותרת מחוץ לכרטיס - נראה מודרני יותר */}
      <Box mb={3} textAlign="center">
          <Typography variant="h4" fontWeight="800" color="#1a237e" gutterBottom>
            פתיחת קריאת שירות חדשה
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ maxWidth: 500, mx: 'auto' }}>
            אנא פרט את הבעיה ככל האפשר כדי שנוכל לעזור לך במהירות וביעילות.
          </Typography>
      </Box>

      <Paper 
        elevation={0} 
        sx={{ 
            p: { xs: 3, md: 5 }, // ריווח פנימי גדול יותר
            borderRadius: 4, 
            border: '1px solid #e0e0e0', // גבול עדין במקום צל כבד
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)' // צללית רכה מאוד
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            
            {/* Subject Field */}
            <Grid size={{ xs: 12, md: 8 }}>
                <TextField
                  required
                  fullWidth
                  label="נושא הפניה"
                  name="subject"
                  placeholder="לדוגמה: תקלה במדפסת בקומה 3"
                  value={formData.subject}
                  onChange={handleChange}
                  variant="outlined"
                  error={!!errors.subject}
                  helperText={errors.subject}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} // פינות עגולות לשדות
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SubjectIcon color={errors.subject ? "error" : "action"} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
            </Grid>

            {/* Priority Select */}
            <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  select
                  required
                  fullWidth
                  label="רמת דחיפות"
                  name="priority_id"
                  value={formData.priority_id}
                  onChange={handleChange}
                  error={!!errors.priority_id}
                  helperText={errors.priority_id}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LowPriorityIcon color={errors.priority_id ? "error" : "action"} />
                        </InputAdornment>
                      ),
                    },
                  }}
                >
                  {priorities.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
            </Grid>

            {/* Description Field */}
            <Grid size={{ xs: 12 }}>
                <TextField
                  required
                  fullWidth
                  label="תיאור מלא של הבעיה"
                  name="description"
                  multiline
                  minRows={6} // קצת יותר גבוה
                  placeholder="תאר את השלבים שהובילו לתקלה..."
                  value={formData.description}
                  onChange={handleChange}
                  variant="outlined"
                  error={!!errors.description}
                  helperText={errors.description}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                          <DescriptionIcon color={errors.description ? "error" : "action"} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
            </Grid>

            <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 1 }} />
            </Grid>

            {/* Actions Buttons */}
            <Grid size={{ xs: 12 }} display="flex" gap={2} justifyContent="space-between">
                <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/dashboard')}
                    sx={{ px: 4, py: 1.2, borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
                >
                    ביטול
                </Button>

                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    endIcon={
                      loading ?
                        <CircularProgress size={20} color="inherit" /> :
                        <SendIcon sx={{ transform: 'scaleX(-1)', mr: 1 }} />
                    }
                    sx={{ 
                        px: 6, 
                        py: 1.2, 
                        borderRadius: 2, 
                        fontWeight: 'bold', 
                        fontSize: '1.1rem',
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)' // צללית יפה לכפתור
                    }}
                >
                    {loading ? 'שולח...' : 'פתח פניה'}
                </Button>
            </Grid>

          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default NewTicketPage;