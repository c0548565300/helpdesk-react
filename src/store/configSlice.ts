import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getStatusesApi, getPrioritiesApi, createStatusApi, createPriorityApi } from '../api/api.service';

interface ConfigState {
  statuses: { id: number; name: string }[];
  priorities: { id: number; name: string }[];
  loading: boolean;
  error: string | null;
}

const initialState: ConfigState = {
  statuses: [],
  priorities: [],
  loading: false,
  error: null,
};

export const fetchMetadata = createAsyncThunk(
  'config/fetchMetadata',
  async (_, { rejectWithValue }) => {
    try {
      const [statusesRes, prioritiesRes] = await Promise.all([
        getStatusesApi(),
        getPrioritiesApi()
      ]);
      return {
        statuses: statusesRes.data,
        priorities: prioritiesRes.data
      };
    } catch (error: any) {
      return rejectWithValue('נכשלה טעינת הגדרות מערכת');
    }
  }
);

export const addStatus = createAsyncThunk(
  'config/addStatus',
  async (name: string, { rejectWithValue }) => {
    try {
      const response = await createStatusApi({ name });
      return response.data;
    } catch (error: any) {
      return rejectWithValue('נכשלה הוספת סטטוס');
    }
  }
);

export const addPriority = createAsyncThunk(
    'config/addPriority',
    async (name: string, { rejectWithValue }) => {
        try {
            const response = await createPriorityApi({ name });
            return response.data;
        } catch (error: any) {
            return rejectWithValue("שגיאה ביצירת רמת דחיפות");
        }
    }
)
const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMetadata.fulfilled, (state, action) => {
        state.statuses = action.payload.statuses;
        state.priorities = action.payload.priorities;
        state.loading = false;
      })
      .addCase(addStatus.fulfilled, (state, action) => {
        state.statuses.push(action.payload); 
      })
      .addCase(addPriority.fulfilled, (state, action) => {
        state.priorities.push(action.payload);
    });
  },
});

export const configSliceReducer = configSlice.reducer;