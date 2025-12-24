import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { Ticket, TicketState } from "../types/models";
import { getTicketsApi, getUserApi, updateTicketApi } from "../api/api.service";// ה-API שכבר כתבת

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
export const assignAgent = createAsyncThunk(
    'tickets/assignAgent',
    async ({ ticketId, agentId }: { ticketId: number; agentId: number }, { rejectWithValue }) => {
        try {
            const response = await updateTicketApi(ticketId, { assigned_to: agentId });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "שגיאה בשיוך סוכן");
        }
    }
);

const initialState: TicketState = {
    tickets: [],
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
            .addCase(assignAgent.fulfilled, (state, action) => {
                const index = state.tickets.findIndex(t => t.id === action.payload.id);
                if (index !== -1) {
                    state.tickets[index] = action.payload;
                }
            });
    }
});

export const { resetTickets, addTicket, updateTicketInList, deleteTicketFromList } = ticketSlice.actions;
export const ticketSliceReducer = ticketSlice.reducer;