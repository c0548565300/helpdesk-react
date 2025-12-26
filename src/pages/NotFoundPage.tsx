import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Button, Container, Stack, Paper, Avatar
} from '@mui/material';

// Icons
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; 
import ScreenSearchDesktopIcon from '@mui/icons-material/ScreenSearchDesktop';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

export const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Box 
            dir="rtl" 
            sx={{ 
                minHeight: '85vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: '#f4f6f8',
                p: 2,
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* רקע דקורטיבי */}
            <Typography
                variant="h1"
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: { xs: '10rem', md: '20rem' },
                    fontWeight: 900,
                    color: 'rgba(0,0,0,0.03)',
                    zIndex: 0,
                    userSelect: 'none'
                }}
            >
                404
            </Typography>

            <Container maxWidth="sm" sx={{ zIndex: 1, position: 'relative' }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 4, md: 6 },
                        textAlign: 'center',
                        borderRadius: 4,
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid #e0e0e0',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)'
                    }}
                >
                    <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
                        <ScreenSearchDesktopIcon sx={{ fontSize: 100, color: '#90caf9', opacity: 0.8 }} />
                        <Avatar 
                            sx={{ 
                                width: 40, height: 40, bgcolor: 'error.main', 
                                position: 'absolute', top: -10, right: -10,
                                border: '3px solid white'
                            }}
                        >
                            <QuestionMarkIcon sx={{ fontSize: 24 }} />
                        </Avatar>
                    </Box>
                    
                    <Typography variant="h3" fontWeight="800" color="#1976d2" gutterBottom>
                        אופס! העמוד לא נמצא.
                    </Typography>
                    
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontWeight: 'normal', lineHeight: 1.6 }}>
                        נראה שהגעת לקישור שבור או לעמוד שכבר לא קיים.
                        <br />
                        אל דאגה, זה קורה לטובים ביותר.
                    </Typography>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<ArrowForwardIcon />} 
                            onClick={() => navigate('/dashboard')}
                            sx={{ 
                                px: 4, py: 1.5, borderRadius: 2, fontWeight: 'bold', fontSize: '1.1rem',
                                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                            }}
                        >
                           חזרה ללוח הבקרה
                        </Button>
                        
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate(-1)}
                            sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 'bold' }}
                        >
                            חזור לעמוד הקודם
                        </Button>
                    </Stack>

                </Paper>
            </Container>
        </Box>
    );
};