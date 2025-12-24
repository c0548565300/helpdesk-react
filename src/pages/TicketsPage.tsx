import React from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { selectFilteredTickets, updateTicket } from "../store/ticketSlice";
import { selectAgents } from "../store/userSlice";
import {
    Container, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Select, MenuItem,
    Chip, IconButton, Tooltip
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";

const Tickets: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // שליפת הנתונים בעזרת הסלקטורים והסטייט
    const myTickets = useAppSelector(selectFilteredTickets);
    const agents = useAppSelector(selectAgents);
    const { user } = useAppSelector((state) => state.auth);
    const { statuses } = useAppSelector((state) => state.config);

    // פונקציות העזר מעודכנות למבנה ה-Payload החדש
    const handleStatusChange = (ticketId: number, statusId: number) => {
        dispatch(updateTicket({
            ticketId,
            data: { status_id: statusId }
        }));
    };

    const handleAgentChange = (ticketId: number, agentId: number) => {
        dispatch(updateTicket({
            ticketId,
            data: { assigned_to: agentId }
        }));
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                ניהול פניות שירות
            </Typography>

            <TableContainer component={Paper} elevation={4} sx={{ borderRadius: 3 }}>
                <Table sx={{ minWidth: 700 }}>
                    <TableHead sx={{ bgcolor: "#f8f9fa" }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>נושא</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>דחיפות</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>סטטוס</TableCell>

                            {/* עמודה שמוצגת רק למנהל לצורך הקצאת סוכנים */}
                            {user?.role === "admin" && (
                                <TableCell sx={{ fontWeight: "bold" }}>סוכן מטפל</TableCell>
                            )}

                            <TableCell sx={{ fontWeight: "bold" }}>תאריך</TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>פרטים</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {myTickets.map((ticket) => (
                            <TableRow key={ticket.id} hover>
                                <TableCell>#{ticket.id}</TableCell>
                                <TableCell sx={{ fontWeight: 500 }}>{ticket.subject}</TableCell>

                                <TableCell>
                                    <Chip
                                        label={ticket.priority_name}
                                        size="small"
                                        variant="outlined"
                                        color={ticket.priority_name === "High" ? "error" : "default"}
                                    />
                                </TableCell>

                                <TableCell>
                                    {/* לקוח רואה סטטוס כטקסט, סוכן/אדמין רואים Select לעדכון */}
                                    {user?.role === "customer" ? (
                                        <Chip label={ticket.status_name} color="info" size="small" />
                                    ) : (
                                        <Select
                                            value={ticket.status_id}
                                            size="small"
                                            // תיקון: שליחת הערך כ-Number ישירות לפונקציה
                                            onChange={(e) => handleStatusChange(ticket.id, Number(e.target.value))}
                                            sx={{ minWidth: 130 }}
                                        >
                                            {statuses.map((s) => (
                                                <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                </TableCell>

                                {/* עמודת ניהול סוכנים למנהל בלבד */}
                                {user?.role === "admin" && (
                                    <TableCell>
                                        <Select
                                            value={ticket.assigned_to || ""}
                                            size="small"
                                            displayEmpty
                                            // תיקון: שליחת הערך כ-Number ישירות לפונקציה
                                            onChange={(e) => handleAgentChange(ticket.id, Number(e.target.value))}
                                            sx={{ minWidth: 160 }}
                                        >
                                            <MenuItem value=""><em>טרם הוקצה</em></MenuItem>
                                            {agents.map((agent) => (
                                                <MenuItem key={agent.id} value={agent.id}>{agent.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </TableCell>
                                )}

                                <TableCell>
                                    {new Date(ticket.created_at).toLocaleDateString("he-IL")}
                                </TableCell>

                                <TableCell align="center">
                                    <Tooltip title="צפה בפרטי הטיקט">
                                        <IconButton
                                            color="primary"
                                            onClick={() => navigate(`/tickets/${ticket.id}`)}
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}

                        {myTickets.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={user?.role === "admin" ? 7 : 6} align="center" sx={{ py: 4 }}>
                                    <Typography color="textSecondary">לא נמצאו פניות להצגה</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default Tickets;