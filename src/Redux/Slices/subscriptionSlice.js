import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL, getCurrentLanguage, getToken } from "../../shared/utils.js/utils";
import { fetchProfile } from "./authSlice";

const getHeaders = (extra = {}) => {
  const token = getToken();
  const lang = getCurrentLanguage();
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "Accept-Language": lang,
    ...extra,
  };
};

const parseError = (error, fallbackMessage) => {
  const message = error?.response?.data?.message || error?.message || fallbackMessage;
  return {
    status: error?.response?.status || 500,
    code: error?.response?.data?.code || error?.response?.status || 500,
    message,
    errors: error?.response?.data?.errors || null,
  };
};

const initialRequestState = { 
  status: "idle", 
  error: null, 
  success: null,
  data: null,
};

const initialState = {
  subscribe: { ...initialRequestState },
};

export const subscribeUser = createAsyncThunk(
  "subscription/subscribeUser",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/subscriptions/subscribe`, {}, {
        headers: getHeaders({ "Content-Type": "application/json" }),
      });
      // Refetch profile to update user.is_subscribed
      dispatch(fetchProfile());
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error, "Failed to subscribe"));
    }
  }
);

const setPending = (state, key) => {
  state[key].status = "loading";
  state[key].error = null;
  state[key].success = null;
};

const setSuccess = (state, key, action) => {
  state[key].status = "succeeded";
  state[key].success = action.payload?.message || "Success";
  state[key].data = action.payload;
};

const setFail = (state, key, action, fallback) => {
  state[key].status = "failed";
  state[key].error = action.payload?.message || fallback;
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    clearSubscriptionState: (state, action) => {
      const key = action.payload;
      if (state[key]) state[key] = { ...initialRequestState };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(subscribeUser.pending, (state) => setPending(state, "subscribe"))
      .addCase(subscribeUser.fulfilled, (state, action) => setSuccess(state, "subscribe", action))
      .addCase(subscribeUser.rejected, (state, action) => setFail(state, "subscribe", action, "Subscription failed"));
  },
});

export const { clearSubscriptionState } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;

