import axios from "axios";
import type { AuthState, CreateUserPayload, LoginForm, Ticket, TicketPayload, User } from "../types/models";

const apiUrl = "http://localhost:4000";

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

export const getUserByIdApi = async (id: number) => {
    return await axios.get<User>(`${apiUrl}/users/${id}`, {
        headers: getAuthHeader()
    });
};
// --- Auth APIs ---

export const loginApi = async (data: LoginForm) =>
    await axios.post<AuthState>(`${apiUrl}/auth/login`, data);


export const registerApi = async (data: CreateUserPayload) => {
    return await axios.post(`${apiUrl}/auth/register`, data, {
        headers: { 'Content-Type': 'application/json' }
    });
};


// --- Ticket APIs ---

export const getTicketsApi = async () => {
    return await axios.get<Ticket[]>(`${apiUrl}/tickets`, {
        headers: getAuthHeader()
    });
};


export const createTicketApi = async (data: TicketPayload) => {
    return await axios.post<Ticket>(`${apiUrl}/tickets`, data, {
        headers: getAuthHeader()
    });
};

export const getTicketByIdApi = async (id: number) => {
    return await axios.get<Ticket>(`${apiUrl}/tickets/${id}`, {
        headers: getAuthHeader()
    });
};


export const updateTicketApi = async (id: number, data: Partial<TicketPayload>) => {
    return await axios.patch<Ticket>(`${apiUrl}/tickets/${id}`, data, {
        headers: getAuthHeader()
    });
};

export const deleteTicketApi = async (id: number) => {
    return await axios.delete(`${apiUrl}/tickets/${id}`, {
        headers: getAuthHeader()
    });
};

//--- User APIs ---
export const getUserApi = async () => {
    return await axios.get<User[]>(`${apiUrl}/users`, {
        headers: getAuthHeader()
    });
};
export const registerUserApi = async (userData: CreateUserPayload) => {
    return await axios.post<User>(`${apiUrl}/users`, userData, {
        headers: getAuthHeader()
    });
};
//--- Config APIs ---
export const getStatusesApi = async () => {
    return await axios.get<{ id: number; name: string }[]>(`${apiUrl}/statuses`, {
        headers: getAuthHeader()
    });
};

export const getPrioritiesApi = async () => {
    return await axios.get<{ id: number; name: string }[]>(`${apiUrl}/priorities`, {
        headers: getAuthHeader()
    });
};
export const createStatusApi = async (data: { name: string }) => {
    return await axios.post<{ id: number; name: string }>(`${apiUrl}/statuses`, data, {
        headers: getAuthHeader()
    });
}
export const createPriorityApi = async (data: { name: string }) => {
    return await axios.post<{ id: number; name: string }>(`${apiUrl}/priorities`, data, {
        headers: getAuthHeader()
    });
}

//--- Comments APIs ---
export const getCommentsByTicketIdApi = async (ticketId: number) => {
    return await axios.get(`${apiUrl}/tickets/${ticketId}/comments`, {
        headers: getAuthHeader()
    });
};
export const addCommentApi = async (ticketId: number, content: string) => {
    return await axios.post(`${apiUrl}/tickets/${ticketId}/comments`, { content }, {
        headers: getAuthHeader()
    });
};
