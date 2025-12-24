import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState } from "../types/models";

const initialState: AuthState = {
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null,
    token: localStorage.getItem("token") || null,
}
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:
    {
        setCredentials: (state, action: PayloadAction<AuthState>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem("user", JSON.stringify(action.payload.user));
            localStorage.setItem("token", action.payload.token!);
        },
        logout: (state) => {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            state.user = null;
            state.token = null;
        }

    }

}
);
export  const {setCredentials,logout} = authSlice.actions;
export const authSliceReducer = authSlice.reducer;