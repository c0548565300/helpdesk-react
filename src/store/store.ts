import { configureStore } from "@reduxjs/toolkit";
import { authSliceReducer } from "./authSlice";
import { ticketSliceReducer } from "./ticketSlice"; 
import { configSliceReducer } from "./configSlice";
import { userSliceReducer } from "./userSlice";
export const store=configureStore({
    reducer:{
        auth:authSliceReducer,
        ticket:ticketSliceReducer,
        config:configSliceReducer,
        users:userSliceReducer
    }
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;