import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Link
} from '@mui/material';

import { LoginPage } from './LoginPage';
import { RegisterPage } from './RegisterPage';

export const AuthPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isLogin = location.pathname !== '/register';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', 
        py: 4
      }}
    >
      <Container maxWidth="xs">
        <Card elevation={8} sx={{ borderRadius: 4, overflow: 'hidden' }}>
          
          <Box sx={{ bgcolor: '#1976d2', p: 4, textAlign: 'center', color: 'white' }}>
            <Typography variant="h4" fontWeight="800" sx={{ letterSpacing: 2 }}>
              HELPDESK
            </Typography>
            <Typography variant="subtitle2" sx={{ opacity: 0.9, mt: 1 }}>
              מערכת ניהול פניות מתקדמת
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" align="center" gutterBottom fontWeight="700" sx={{ mb: 3, color: '#333' }}>
              {isLogin ? 'ברוכים הבאים' : 'יצירת חשבון חדש'}
            </Typography>

            {isLogin ? <LoginPage /> : <RegisterPage />}

            <Box textAlign="center" mt={4}>
              <Typography variant="body2" color="textSecondary">
                {isLogin ? "עדיין אין לך חשבון? " : "כבר יש לך חשבון? "}
                <Link
                  component="button"
                  variant="body2"
                  fontWeight="bold"
                  onClick={() => navigate(isLogin ? '/register' : '/login')}
                  sx={{ textDecoration: 'none', cursor: 'pointer' }}
                >
                  {isLogin ? 'הירשם כאן' : 'התחבר כאן'}
                </Link>
              </Typography>
            </Box>

          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};