import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { loginUser } from '../store/authSlice'; 
import { TextField, Button, Box, Alert, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import { Visibility, Email, Lock, VisibilityOff } from '@mui/icons-material';
import type { LoginForm } from '../types/models';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    try {
      await dispatch(loginUser(data)).unwrap();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err || 'פרטי התחברות שגויים');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box display="flex" flexDirection="column" gap={3}>
        <Controller
          name="email"
          control={control}
          rules={{ required: 'חובה להזין אימייל' }}
          render={({ field }) => (
            <TextField
              {...field}
              label="כתובת אימייל"
              fullWidth
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Email color="action" /></InputAdornment>,
                sx: { borderRadius: 2 }
              }}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          rules={{ required: 'חובה להזין סיסמה' }}
          render={({ field }) => (
            <TextField
              {...field}
              type={showPassword ? 'text' : 'password'}
              label="סיסמה"
              fullWidth
              variant="outlined"
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                sx: { borderRadius: 2 },
                startAdornment: <InputAdornment position="start"><Lock color="action" /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          )}
        />
        
        {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}
        
        <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            size="large" 
            disabled={isSubmitting}
            sx={{ borderRadius: 2, py: 1.5, fontSize: '1.1rem', fontWeight: 'bold' }}
        >
          {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'התחבר למערכת'}
        </Button>
      </Box>
    </form>
  );
};