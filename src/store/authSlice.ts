import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, RegisterPayload, LoginForm } from "../types/models";
import { loginApi, registerApi } from "../api/api.service";

const initialState: AuthState = {
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null,
    token: localStorage.getItem("token") || null,
}

export const loginUser = createAsyncThunk(
    'auth/login',
    async (data: {email: string, password: string}, { dispatch, rejectWithValue }) => {
        try {
            const response = await loginApi(data);
            dispatch(setCredentials(response.data));
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'התחברות נכשלה');
        }
    }
);

export const registerAndLogin = createAsyncThunk(
    'auth/registerAndLogin',
    async (data: RegisterPayload, { dispatch, rejectWithValue }) => {
        try {
            await registerApi(data);
            
            const loginResponse = await loginApi({ 
                email: data.email, 
                password: data.password 
            });

            dispatch(setCredentials(loginResponse.data));
            
            return loginResponse.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'תהליך הרישום נכשל');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<AuthState>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            if (action.payload.user && action.payload.token) {
                localStorage.setItem("user", JSON.stringify(action.payload.user));
                localStorage.setItem("token", action.payload.token);
            }
        },
        logout: (state) => {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            state.user = null;
            state.token = null;
        }
    }
});

export const { setCredentials, logout } = authSlice.actions;
export const authSliceReducer = authSlice.reducer;