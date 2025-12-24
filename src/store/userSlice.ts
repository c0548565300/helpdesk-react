import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserApi, getUserByIdApi, registerUserApi } from '../api/api.service';
import { type User, type CreateUserPayload } from '../types/models';

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
      // 1. קריאה ראשונה: יצירת המשתמש
      const createResponse = await registerUserApi(userData);
      
      // השרת מחזיר לנו רק: { id: 8 }
      const newUserId = createResponse.data.id;

      // 2. קריאה שנייה: שליפת המשתמש המלא לפי ה-ID שקיבלנו
      const fullUserResponse = await getUserByIdApi(newUserId);

      // 3. החזרה: אנחנו מחזירים ל-Reducer את המשתמש המלא מהקריאה השנייה!
      // (כולל created_at אמיתי מהשרת)
      return fullUserResponse.data;

    } catch (error: any) {
      const message = error.response?.data?.message || "שגיאה ביצירת משתמש";
      return rejectWithValue(message);
    }
  }
);

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