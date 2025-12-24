import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserApi, getUserByIdApi, registerUserApi } from '../api/api.service';
import { type User, type CreateUserPayload } from '../types/models';
import type { RootState } from "./store";

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response.data;
    } catch (error: any) {
      return rejectWithValue("שגיאה בטעינת משתמשים");
    }
  }
);


export const addUser = createAsyncThunk(
  'users/addUser',
  async (userData: CreateUserPayload, { rejectWithValue }) => {
    try {
      const createResponse = await registerUserApi(userData);
      
      const newUserId = createResponse.data.id;

      const fullUserResponse = await getUserByIdApi(newUserId);

      return fullUserResponse.data;

    } catch (error: any) {
      const message = error.response?.data?.message || "שגיאה ביצירת משתמש";
      return rejectWithValue(message);
    }
  }
);
export const selectAgents=(state:RootState)=>{
 return state.users.users.filter(user=>user.role==='agent');
}
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(addUser.fulfilled, (state, action) => {

        console.log("New User Added:", action.payload);

        state.users.push(action.payload);
      });
  },
});

export const userSliceReducer = userSlice.reducer;