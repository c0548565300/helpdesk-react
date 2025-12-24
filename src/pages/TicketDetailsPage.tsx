import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchTicketById, addComment } from "../store/ticketSlice";

import {
    Container, Paper, Typography, Box, Chip, Button,
    CircularProgress, Alert, Divider, TextField, IconButton, Avatar
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PersonIcon from '@mui/icons-material/Person';

export const TicketDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const commentsEndRef = useRef<HTMLDivElement>(null);
    const [newComment, setNewComment] = useState("");

    const { selectedTicket, loading, error } = useAppSelector((state) => state.ticket);
    const { user } = useAppSelector((state) => state.auth);

    // טעינת הטיקט
    useEffect(() => {
        if (id) {
            dispatch(fetchTicketById({ ticketId: Number(id) }));
        }
    }, [dispatch, id]);

    // גלילה אוטומטית למטה
    useEffect(() => {
        commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [selectedTicket?.comments]);

    const handleSendComment = async () => {
        if (!newComment.trim() || !id) return;

        // הפעולה תחכה לתשובת השרת (await)
        // השרת יחזיר את ההודעה החדשה כולל התאריך הנכון, וה-Reducer יוסיף אותה למסך
        await dispatch(addComment({ ticketId: Number(id), content: newComment }));
        
        setNewComment("");
    };

    // --- Loading & Error States ---
    if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;
    if (error) return <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert><Button onClick={() => navigate('/tickets')}>חזרה</Button></Container>;
    if (!selectedTicket) return <Typography sx={{ mt: 4, textAlign: 'center' }}>הטיקט לא נמצא</Typography>;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/tickets')}
                sx={{ mb: 2 }}
            >
                חזרה לרשימה
            </Button>

            <Box display="flex" gap={3} flexDirection={{ xs: 'column', md: 'row' }}>

                {/* --- צד ימין: פרטי הטיקט --- */}
                <Box flex={1}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                            <Typography variant="h5" fontWeight="bold">
                                {selectedTicket.subject}
                            </Typography>
                            <Chip
                                label={selectedTicket.status_name}
                                color={selectedTicket.status_name === 'Open' ? 'success' : 'default'}
                                variant="filled"
                            />
                        </Box>

                        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                            {/* כאן אנחנו משתמשים בשמות שמגיעים מהטיקט עצמו */}
                            נוצר ע"י: {selectedTicket.created_by_name} | {new Date(selectedTicket.created_at).toLocaleDateString('he-IL')}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>תיאור:</Typography>
                        <Box sx={{ bgcolor: '#f9f9f9', p: 2, borderRadius: 1, minHeight: 100 }}>
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                {selectedTicket.description}
                            </Typography>
                        </Box>

                        <Box mt={3} display="flex" gap={1} flexWrap="wrap">
                            <Chip label={`דחיפות: ${selectedTicket.priority_name}`} size="small" />
                            {/* הסוכן מוצג משדה בטיקט, אין צורך בבקשת שרת נפרדת */}
                            <Chip label={`סוכן: ${selectedTicket.assigned_to_name || 'טרם הוקצה'}`} size="small" variant="outlined" />
                        </Box>
                    </Paper>
                </Box>

                {/* --- צד שמאל: הצ'אט --- */}
                <Box flex={1} display="flex" flexDirection="column" sx={{ height: '600px' }}>
                    <Paper elevation={3} sx={{
                        flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 2, overflow: 'hidden'
                    }}>
                        <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                            <Typography variant="h6">התכתבות ועדכונים</Typography>
                        </Box>

                        {/* אזור ההודעות */}
                        <Box sx={{
                            flex: 1, overflowY: 'auto', p: 2, bgcolor: '#f0f2f5',
                            display: 'flex', flexDirection: 'column', gap: 2
                        }}>
                            {selectedTicket.comments && selectedTicket.comments.length > 0 ? (
                                selectedTicket.comments.map((comment: any, index: number) => {
                                    const isMe = comment.user_id === user?.id;
                                    
                                    // חישוב התאריך בצורה בטוחה
                                    const dateObj = new Date(comment.created_at);
                                    const timeString = !isNaN(dateObj.getTime()) 
                                        ? dateObj.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
                                        : "ממש כעת"; // אם התאריך עוד לא התעדכן

                                    return (
                                        <Box
                                            key={index}
                                            display="flex"
                                            // שינוי לוגיקה: אחרים בימין, אני בשמאל
                                            justifyContent={isMe ? 'flex-start' : 'flex-end'}
                                        >
                                            {/* אווטאר לאחרים (בימין) */}
                                            {!isMe && (
                                                <Avatar sx={{ width: 32, height: 32, ml: 1, bgcolor: 'warning.main' }}>
                                                    <SupportAgentIcon fontSize="small" />
                                                </Avatar>
                                            )}
                                            
                                            {/* אווטאר לי (בשמאל) */}
                                            {isMe && (
                                                <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}>
                                                    <PersonIcon fontSize="small" />
                                                </Avatar>
                                            )}

                                            <Paper sx={{
                                                p: 1.5,
                                                maxWidth: '80%',
                                                // צהוב לאחרים, לבן/אפור לי
                                                bgcolor: isMe ? 'white' : '#fff9c4', 
                                                borderRadius: 2,
                                                // עיגול פינות בהתאם לצד
                                                borderTopLeftRadius: isMe ? 0 : 2,
                                                borderTopRightRadius: !isMe ? 0 : 2
                                            }}>
                                                <Typography variant="subtitle2" fontWeight="bold" fontSize="0.8rem" color="textSecondary" align={isMe ? 'left' : 'right'}>
                                                    {comment.user_name}
                                                </Typography>
                                                
                                                <Typography variant="body2" align={isMe ? 'left' : 'right'}>
                                                    {comment.content}
                                                </Typography>
                                                
                                                <Typography variant="caption" display="block" textAlign={isMe ? 'left' : 'right'} color="textSecondary" mt={0.5}>
                                                    {timeString}
                                                </Typography>
                                            </Paper>
                                        </Box>
                                    );
                                })
                            ) : (
                                <Typography color="textSecondary" align="center" mt={4}>
                                    אין הודעות עדיין...
                                </Typography>
                            )}
                            <div ref={commentsEndRef} />
                        </Box>

                        {/* תיבת שליחה */}
                        <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid #e0e0e0' }}>
                            <Box display="flex" gap={1}>
                                <TextField
                                    fullWidth placeholder="כתוב תגובה..." size="small"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
                                    multiline maxRows={3}
                                />
                                <IconButton color="primary" onClick={handleSendComment} disabled={!newComment.trim()}>
                                    <SendIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </Container>
    );
};