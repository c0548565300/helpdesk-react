import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { Ticket, TicketPayload, TicketState } from "../types/models";
import { addCommentApi, createTicketApi, getTicketByIdApi, getTicketsApi, updateTicketApi } from "../api/api.service";// ה-API שכבר כתבת
import type { RootState } from "./store";
export const createTicket = createAsyncThunk(
    'tickets/createTicket',
    async (data: TicketPayload, { rejectWithValue }) => {
        try {
            const response = await createTicketApi(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "שגיאה ביצירת טיקט");
        }
    }
);
export const fetchTickets = createAsyncThunk(
    'tickets/fetchTickets',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getTicketsApi();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "שגיאה בטעינת נתונים");
        }
    }
);
export const updateTicket = createAsyncThunk(
    'tickets/updateTicket',
    async ({ ticketId, data }: { ticketId: number; data: Partial<TicketPayload> }, { rejectWithValue }) => {
        try {
            const response = await updateTicketApi(ticketId, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "שגיאה בעדכון הטיקט");
        }
    }
);
export const fetchTicketById = createAsyncThunk(
    'tickets/ticketByID',
    async ({ ticketId }: { ticketId: number; }, { rejectWithValue }) => {
        try {
            const response = await getTicketByIdApi(ticketId);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "שגיאה בשליפת הטיקט");
        }
    }
);
export const addComment = createAsyncThunk(
    'tickets/addComment',
    async ({ ticketId, content }: { ticketId: number; content: string }, { rejectWithValue }) => {
        try {
            const response = await addCommentApi(ticketId, content);
            return response.data; // השרת אמור להחזיר את אובייקט ה-Comment החדש
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "שגיאה בשליחת תגובה");
        }
    }
);
export const selectFilteredTickets = (state: RootState) => {
    const { tickets } = state.ticket;
    const { user } = state.auth;

    if (!user) return [];

    switch (user.role) {
        case 'customer':
            return tickets.filter(t => t.created_by === user.id);
        case 'agent':
            return tickets.filter(t => t.assigned_to === user.id);
        case 'admin':
            return tickets;
        default:
            return [];
    }
};

const initialState: TicketState = {
    tickets: [],
    selectedTicket: null,
    loading: false,
    error: null,
};
const ticketSlice = createSlice({
    name: 'ticket',
    initialState,
    reducers: {

        addTicket: (state, action: PayloadAction<Ticket>) => {
            state.tickets.push(action.payload);
        },
        updateTicketInList: (state, action: PayloadAction<Ticket>) => {
            const index = state.tickets.findIndex(t => t.id === action.payload.id);
            if (index !== -1) state.tickets[index] = action.payload;
        },
        deleteTicketFromList: (state, action: PayloadAction<number>) => {
            state.tickets = state.tickets.filter(t => t.id !== action.payload);
        },
        resetTickets: (state) => {
            state.tickets = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTickets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTickets.fulfilled, (state, action) => {
                state.loading = false;
                state.tickets = action.payload;
            })
            .addCase(fetchTickets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateTicket.fulfilled, (state, action) => {
                const index = state.tickets.findIndex(t => t.id === action.payload.id);
                if (index !== -1) {
                    state.tickets[index] = action.payload;
                }
            })
            .addCase(createTicket.fulfilled, (state, action) => {
                state.tickets.push(action.payload);
            })
            .addCase(fetchTicketById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.selectedTicket = null;
            })
            .addCase(fetchTicketById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedTicket = action.payload;
            })
            .addCase(fetchTicketById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(addComment.fulfilled, (state, action) => {
                if (state.selectedTicket && state.selectedTicket.id === action.payload.ticket_id) {
                    if (!state.selectedTicket.comments) {
                        state.selectedTicket.comments = [];
                    }
                    state.selectedTicket.comments.push(action.payload);
                }
            });
    }
});

export const { resetTickets, addTicket, updateTicketInList, deleteTicketFromList } = ticketSlice.actions;
export const ticketSliceReducer = ticketSlice.reducer;