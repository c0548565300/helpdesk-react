import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { registerAndLogin } from '../store/authSlice';
import { TextField, Button, Box, Alert, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import { Visibility, Person, Email, Lock } from '@mui/icons-material';
import type { RegisterPayload } from '../types/models';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { name: '', email: '', password: '', role: 'customer' }
  });

  const onSubmit = async (data: RegisterPayload) => {
    setError(null);
    try {
      await dispatch(registerAndLogin(data)).unwrap();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err || 'ההרשמה נכשלה');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box display="flex" flexDirection="column" gap={2.5}>
        <Controller
          name="name"
          control={control}
          rules={{ required: 'חובה להזין שם' }}
          render={({ field }) => (
            <TextField
              {...field}
              label="שם מלא"
              fullWidth
              error={!!errors.name}
              helperText={errors.name?.message}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><Person color="action" /></InputAdornment> } }}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          rules={{ 
            required: 'חובה להזין אימייל',
            pattern: { value: /^\S+@\S+$/i, message: 'אימייל לא תקין' }
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="אימייל"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><Email color="action" /></InputAdornment> } }}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          rules={{ 
            required: 'חובה להזין סיסמה',
            minLength: { value: 6, message: 'מינימום 6 תווים' }
          }}
          render={({ field }) => (
            <TextField
              {...field}
              type={showPassword ? 'text' : 'password'}
              label="סיסמה"
              fullWidth
              error={!!errors.password}
              helperText={errors.password?.message}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start"><Lock color="action" /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end"><Visibility /></IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />
          )}
        />
        {error && <Alert severity="error">{error}</Alert>}
        <Button type="submit" variant="contained" fullWidth size="large" color="secondary" disabled={isSubmitting}>
          {isSubmitting ? <CircularProgress size={24} /> : 'צור חשבון והתחבר'}
        </Button>
      </Box>
    </form>
  );
};