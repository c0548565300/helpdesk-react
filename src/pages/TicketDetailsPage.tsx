import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchTicketById, addComment, updateTicket } from "../store/ticketSlice";
import { fetchUsers, selectAgents } from "../store/userSlice";
import { fetchMetadata } from "../store/configSlice";
import {
    Container, Typography, Box, TextField, IconButton,
    Paper, Avatar, Divider, CircularProgress, Alert, Chip,
    Grid, MenuItem, Select, FormControl, Card, CardContent,
    Stack,
} from "@mui/material";

// Icons
import SendIcon from '@mui/icons-material/Send';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import LabelIcon from '@mui/icons-material/Label';
import FlagIcon from '@mui/icons-material/Flag';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// פונקציית עזר לטיפול בזמנים
const formatDate = (dateString?: string) => {
    if (!dateString) return "עכשיו";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "עכשיו";
    return new Intl.DateTimeFormat('he-IL', {
        dateStyle: 'short',
        timeStyle: 'short'
    }).format(date);
};

export const TicketDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const [commentText, setCommentText] = useState("");

    // שליפת נתונים
    const { selectedTicket, loading, error } = useAppSelector(state => state.ticket);
    const { user } = useAppSelector(state => state.auth);
    const { statuses, priorities } = useAppSelector(state => state.config);
    const agents = useAppSelector(selectAgents);

    // לוגיקה לזיהוי סטטוס "סגור"
    const closedStatus = statuses.find(s =>
        s.name.toLowerCase() === 'closed' ||
        s.name.includes('סגור') ||
        s.name.toLowerCase() === 'done'
    );
    const CLOSED_ID = closedStatus ? closedStatus.id : 2;
    const isClosed = selectedTicket?.status_id === CLOSED_ID;

    // הרשאות
    const canUpdateStatus = user?.role === 'admin' || user?.role === 'agent';
    const canAssignAgent = user?.role === 'admin';

    useEffect(() => {
        if (id) {
            dispatch(fetchTicketById({ ticketId: Number(id) }));
            dispatch(fetchUsers());
            dispatch(fetchMetadata());
        }
    }, [id, dispatch]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [selectedTicket?.comments]);

    const handleSendComment = async () => {
        if (!commentText.trim() || !id) return;
        await dispatch(addComment({ ticketId: Number(id), content: commentText }));
        setCommentText("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendComment();
        }
    };

    const handleUpdateTicket = (field: string, value: number|string) => {
        if (!selectedTicket) return;
        dispatch(updateTicket({
            ticketId: selectedTicket.id,
            data: { [field]: value }
        }));
    };

    if (loading) return <Box display="flex" justifyContent="center" alignItems="center" height="80vh"><CircularProgress size={60} thickness={4} /></Box>;
    if (error) return <Container sx={{ mt: 5 }}><Alert severity="error" variant="filled" sx={{ borderRadius: 2 }}>{error}</Alert></Container>;
    if (!selectedTicket) return <Container sx={{ mt: 5 }}><Alert severity="warning" variant="filled">הטיקט לא נמצא</Alert></Container>;

    return (
        <Box sx={{ bgcolor: '#f4f6f8', minHeight: '100vh', py: 4 }} dir="rtl">
            <Container maxWidth="xl">

                {/* Header - כרטיס עליון */}
                <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, border: '1px solid #e0e0e0', bgcolor: '#fff' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
                        <Box>
                            <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                                <Chip
                                    label={`#${selectedTicket.id}`}
                                    size="small"
                                    sx={{ fontWeight: 'bold', bgcolor: '#e3f2fd', color: '#1565c0', borderRadius: 1 }}
                                />
                                <Typography variant="h5" fontWeight="800" color="#1a237e">
                                    {selectedTicket.subject}
                                </Typography>
                            </Box>
                            <Stack direction="row" spacing={2} alignItems="center" color="text.secondary">
                                <Box display="flex" alignItems="center" gap={0.5}>
                                    <CalendarTodayIcon fontSize="small" />
                                    <Typography variant="body2">{formatDate(selectedTicket.created_at)}</Typography>
                                </Box>
                                <Divider orientation="vertical" flexItem sx={{ height: 16, alignSelf: 'center' }} />
                                <Box display="flex" alignItems="center" gap={0.5}>
                                    <AccountCircleIcon fontSize="small" />
                                    <Typography variant="body2">נוצר ע"י: {selectedTicket.created_by_name || 'משתמש'}</Typography>
                                </Box>
                            </Stack>
                        </Box>

                        {/* כפתור סטטוס מהיר (ויזואלי בלבד אם אין הרשאה) */}
                        <Box>
                            <Chip
                                label={selectedTicket.status_name}
                                color={isClosed ? 'default' : 'primary'}
                                variant={isClosed ? 'outlined' : 'filled'}
                                sx={{ px: 1, fontWeight: 'bold', height: 32 }}
                            />
                        </Box>
                    </Box>
                </Paper>

                {/* Grid Layout */}
                <Grid container spacing={3}>

                    {/* Main Content Area */}
                    <Grid size={{ xs: 12, md: 8 }} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                        {/* Description Card */}
                        <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3, position: 'relative', overflow: 'visible' }}>
                            <Box sx={{
                                width: 4,
                                height: '100%',
                                bgcolor: 'primary.main',
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                borderTopRightRadius: 12,
                                borderBottomRightRadius: 12
                            }} />
                            <CardContent sx={{ p: 3 }}>
                                <Box display="flex" alignItems="center" gap={1} mb={2}>
                                    <DescriptionIcon color="action" />
                                    <Typography variant="h6" fontWeight="bold">תיאור הפנייה</Typography>
                                </Box>
                                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: '#37474f', lineHeight: 1.6 }}>
                                    {selectedTicket.description}
                                </Typography>
                            </CardContent>
                        </Card>

                        {/* Conversation Area */}
                        <Paper elevation={0} sx={{
                            height: '600px',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: 3,
                            border: '1px solid #e0e0e0',
                            overflow: 'hidden',
                            bgcolor: '#fff'
                        }}>
                            <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
                                <Typography variant="subtitle2" fontWeight="bold" color="text.primary">צ'אט ותגובות</Typography>
                            </Box>

                            {/* Chat Messages */}
                            <Box sx={{
                                flex: 1,
                                overflowY: 'auto',
                                p: 3,
                                bgcolor: '#f5faff', // <-- הנה השינוי: תכלת בהיר עדין מאוד (במקום ה-gradient שהיה קודם)
                                '&::-webkit-scrollbar': { width: '6px' },
                                '&::-webkit-scrollbar-thumb': { backgroundColor: '#bdbdbd', borderRadius: '10px' }
                            }}>
                                {selectedTicket.comments?.length === 0 && (
                                    <Box display="flex" justifyContent="center" mt={4}>
                                        <Chip label="אין תגובות עדיין. היה הראשון להגיב!" sx={{ bgcolor: 'rgba(255,255,255,0.8)' }} />
                                    </Box>
                                )}

                                {selectedTicket.comments?.map((comment) => {
                                    const isMe = user?.id === comment.author_id;
                                    return (
                                        <Box key={comment.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', mb: 2 }}>
                                            <Box sx={{
                                                maxWidth: '80%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: isMe ? 'flex-end' : 'flex-start'
                                            }}>
                                                {!isMe && (
                                                    <Typography variant="caption" sx={{ ml: 1, mb: 0.5, fontWeight: 'bold', color: '#555' }}>
                                                        {comment.author_name}
                                                    </Typography>
                                                )}
                                                <Paper elevation={1} sx={{
                                                    p: 1.5,
                                                    px: 2,
                                                    borderRadius: isMe ? '18px 0 18px 18px' : '0 18px 18px 18px', // כיוון בועה בהתאם לשולח
                                                    bgcolor: isMe ? '#dcf8c6' : '#ffffff', // ירוק בהיר לי ולבן לאחרים
                                                    color: '#000',
                                                    position: 'relative',
                                                    minWidth: '120px'
                                                }}>
                                                    <Typography variant="body1" sx={{ lineHeight: 1.4, fontSize: '0.95rem' }}>{comment.content}</Typography>
                                                    <Box display="flex" justifyContent="flex-end" mt={0.5}>
                                                        <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.45)', fontSize: '0.7rem' }}>
                                                            {formatDate(comment.created_at)}
                                                        </Typography>
                                                    </Box>
                                                </Paper>
                                            </Box>
                                        </Box>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </Box>

                            {/* Input Area */}
                            <Box sx={{ p: 2, bgcolor: '#f0f2f5', borderTop: '1px solid #e0e0e0' }}>
                                <TextField
                                    fullWidth
                                    placeholder={isClosed ? "הטיקט סגור לתגובות" : "הקלד הודעה..."}
                                    variant="outlined"
                                    disabled={isClosed}
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            bgcolor: '#fff',
                                            borderRadius: 3,
                                            '& fieldset': { border: 'none' }, // הסרת מסגרת רגילה למראה נקי
                                        }
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton
                                                onClick={handleSendComment}
                                                color="primary"
                                                disabled={isClosed || !commentText.trim()}
                                                sx={{
                                                    bgcolor: isClosed || !commentText.trim() ? 'transparent' : '#1976d2',
                                                    color: isClosed || !commentText.trim() ? 'grey' : '#fff',
                                                    '&:hover': { bgcolor: '#1565c0' },
                                                    width: 40, height: 40,
                                                    mr: -1
                                                }}
                                            >
                                                <SendIcon fontSize="small" />
                                            </IconButton>
                                        )
                                    }}
                                />
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Sidebar - Control Panel */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0', position: 'sticky', top: 24 }}>
                            <CardContent sx={{ p: 0 }}>
                                <Box sx={{ p: 2.5, bgcolor: '#f8f9fa', borderBottom: '1px solid #eee' }}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <SupportAgentIcon color="primary" />
                                        <Typography variant="h6" fontWeight="bold">פרטי טיקט</Typography>
                                    </Box>
                                </Box>

                                <Stack spacing={3} sx={{ p: 3 }}>
                                    {/* Status */}
                                    <Box>
                                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                                            <LabelIcon color="action" fontSize="small" />
                                            <Typography variant="subtitle2" fontWeight="bold">סטטוס</Typography>
                                        </Box>
                                        {canUpdateStatus ? (
                                            <FormControl fullWidth size="small">
                                                <Select
                                                    value={selectedTicket.status_id || ''}
                                                    onChange={(e) => handleUpdateTicket('status_id', e.target.value)}
                                                    sx={{ borderRadius: 2, bgcolor: '#fff' }}
                                                >
                                                    {statuses.map(status => (
                                                        <MenuItem key={status.id} value={status.id}>
                                                            <Box display="flex" alignItems="center" gap={1}>
                                                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: status.id === CLOSED_ID ? 'grey.400' : 'success.main' }} />
                                                                {status.name}
                                                            </Box>
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        ) : (
                                            <Chip label={selectedTicket.status_name} color="primary" variant="outlined" sx={{ width: '100%', borderRadius: 1 }} />
                                        )}
                                    </Box>

                                    <Divider />

                                    {/* Priority */}
                                    <Box>
                                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                                            <FlagIcon color="action" fontSize="small" />
                                            <Typography variant="subtitle2" fontWeight="bold">דחיפות</Typography>
                                        </Box>
                                        {canUpdateStatus ? (
                                            <FormControl fullWidth size="small">
                                                <Select
                                                    value={selectedTicket.priority_id || ''}
                                                    onChange={(e) => handleUpdateTicket('priority_id', e.target.value)}
                                                    disabled={isClosed}
                                                    sx={{ borderRadius: 2, bgcolor: '#fff' }}
                                                >
                                                    {priorities.map(priority => (
                                                        <MenuItem key={priority.id} value={priority.id}>{priority.name}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        ) : (
                                            <Chip label={selectedTicket.priority_name} sx={{ width: '100%', borderRadius: 1, bgcolor: '#fff3e0', color: '#e65100', fontWeight: 'bold' }} />
                                        )}
                                    </Box>

                                    <Divider />

                                    {/* Assigned To */}
                                    <Box>
                                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                                            <PersonIcon color="action" fontSize="small" />
                                            <Typography variant="subtitle2" fontWeight="bold">נציג מטפל</Typography>
                                        </Box>
                                        {canAssignAgent ? (
                                            <FormControl fullWidth size="small">
                                                <Select
                                                    value={selectedTicket.assigned_to || ''}
                                                    displayEmpty
                                                    onChange={(e) => handleUpdateTicket('assigned_to', e.target.value)}
                                                    disabled={isClosed}
                                                    sx={{ borderRadius: 2, bgcolor: '#fff' }}
                                                >
                                                    <MenuItem value=""><em>-- טרם הוקצה --</em></MenuItem>
                                                    {agents.map(agent => (
                                                        <MenuItem key={agent.id} value={agent.id}>
                                                            <Box display="flex" alignItems="center" gap={1}>
                                                                <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem' }}>{agent.name.charAt(0)}</Avatar>
                                                                {agent.name}
                                                            </Box>
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        ) : (
                                            <Box p={1.5} bgcolor="#f5f5f5" borderRadius={2} border="1px dashed #bdbdbd" display="flex" alignItems="center" gap={1}>
                                                <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem' }}>
                                                    {selectedTicket.assigned_to ? 'A' : '?'}
                                                </Avatar>
                                                <Typography variant="body2" fontWeight="500">
                                                    {selectedTicket.assigned_to
                                                        ? agents.find(a => a.id === selectedTicket.assigned_to)?.name || selectedTicket.assigned_to_name || 'סוכן הוקצה'
                                                        : 'טרם הוקצה'
                                                    }
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                </Grid>
            </Container>
        </Box>
    );
};