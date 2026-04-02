import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL, getCurrentLanguage, getToken } from "../../shared/utils.js/utils";

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

const initialRequestState = { status: "idle", error: null, success: null };

const initialState = {
  login: { ...initialRequestState },
  register: { ...initialRequestState },
  verifyOtp: { ...initialRequestState },
  resendOtp: { ...initialRequestState },
  profile: { ...initialRequestState },
  updateProfile: { ...initialRequestState },
  logout: { ...initialRequestState },
  user: null,
  token: localStorage.getItem("token") || null,
};

export const loginUser = createAsyncThunk("auth/loginUser", async (payload, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("phone", payload.phone);
    formData.append("password", payload.password);
    formData.append("fcm_token", "sfml");

    const response = await axios.post(`${BASE_URL}/login`, formData, {
      headers: getHeaders({ "Content-Type": "multipart/form-data" }),
    });
    const token = response.data?.data?.token;
    if (token) localStorage.setItem("token", token);
    return response.data;
  } catch (error) {
    return rejectWithValue(parseError(error, "Failed to login"));
  }
});

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (payload, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("name", payload.name);
      formData.append("phone", payload.phone);
      formData.append("email", payload.email);
      formData.append("password", payload.password);
      formData.append("password_confirmation", payload.password_confirmation);
      formData.append("role", payload.role);
      formData.append("accept_terms", "1");
      if (payload.image) formData.append("image", payload.image);

      const response = await axios.post(`${BASE_URL}/register`, formData, {
        headers: getHeaders({ "Content-Type": "multipart/form-data" }),
      });
      if (payload.phone) localStorage.setItem("pending_otp_phone", payload.phone);
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error, "Failed to register"));
    }
  }
);

export const verifyOtp = createAsyncThunk("auth/verifyOtp", async (payload, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("phone", payload.phone);
    formData.append("token", payload.token);
    formData.append("fcm_token", "sdm,n");

    const response = await axios.post(`${BASE_URL}/verify-otp`, formData, {
      headers: getHeaders({ "Content-Type": "multipart/form-data" }),
    });
    const authToken = response.data?.data?.token;
    if (authToken) localStorage.setItem("token", authToken);
    localStorage.removeItem("pending_otp_phone");
    return response.data;
  } catch (error) {
    return rejectWithValue(parseError(error, "Failed to verify OTP"));
  }
});

export const resendOtp = createAsyncThunk("auth/resendOtp", async (phone, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("phone", phone);
    const response = await axios.post(`${BASE_URL}/resend-otp`, formData, {
      headers: getHeaders({ "Content-Type": "multipart/form-data" }),
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(parseError(error, "Failed to resend OTP"));
  }
});

export const fetchProfile = createAsyncThunk("auth/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/profile`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(parseError(error, "Failed to fetch profile"));
  }
});

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (payload, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("name", payload.name);
      if (payload.image) formData.append("image", payload.image);

      const response = await axios.post(`${BASE_URL}/profile/update`, formData, {
        headers: getHeaders({ "Content-Type": "multipart/form-data" }),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(parseError(error, "Failed to update profile"));
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/logout`, null, {
      headers: getHeaders(),
    });
    localStorage.removeItem("token");
    return response.data;
  } catch (error) {
    localStorage.removeItem("token");
    return rejectWithValue(parseError(error, "Failed to logout"));
  }
});

const setPending = (state, key) => {
  state[key].status = "loading";
  state[key].error = null;
  state[key].success = null;
};
const setSuccess = (state, key, action) => {
  state[key].status = "succeeded";
  state[key].success = action.payload?.message || "Success";
};
const setFail = (state, key, action, fallback) => {
  state[key].status = "failed";
  state[key].error = action.payload?.message || fallback;
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthState: (state, action) => {
      const key = action.payload;
      if (state[key]) state[key] = { ...initialRequestState };
    },
    setUserFromProfile: (state, action) => {
      state.user = action.payload || null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => setPending(state, "login"))
      .addCase(loginUser.fulfilled, (state, action) => {
        setSuccess(state, "login", action);
        state.user = action.payload?.data?.user || null;
        state.token = action.payload?.data?.token || state.token;
      })
      .addCase(loginUser.rejected, (state, action) => setFail(state, "login", action, "Login failed"))
      .addCase(registerUser.pending, (state) => setPending(state, "register"))
      .addCase(registerUser.fulfilled, (state, action) => setSuccess(state, "register", action))
      .addCase(registerUser.rejected, (state, action) =>
        setFail(state, "register", action, "Registration failed")
      )
      .addCase(verifyOtp.pending, (state) => setPending(state, "verifyOtp"))
      .addCase(verifyOtp.fulfilled, (state, action) => {
        setSuccess(state, "verifyOtp", action);
        state.user = action.payload?.data?.user || state.user;
        state.token = action.payload?.data?.token || state.token;
      })
      .addCase(verifyOtp.rejected, (state, action) =>
        setFail(state, "verifyOtp", action, "OTP verification failed")
      )
      .addCase(resendOtp.pending, (state) => setPending(state, "resendOtp"))
      .addCase(resendOtp.fulfilled, (state, action) => setSuccess(state, "resendOtp", action))
      .addCase(resendOtp.rejected, (state, action) =>
        setFail(state, "resendOtp", action, "Resend OTP failed")
      )
      .addCase(fetchProfile.pending, (state) => setPending(state, "profile"))
      .addCase(fetchProfile.fulfilled, (state, action) => {
        setSuccess(state, "profile", action);
        state.user = action.payload?.data || state.user;
      })
      .addCase(fetchProfile.rejected, (state, action) =>
        setFail(state, "profile", action, "Failed to fetch profile")
      )
      .addCase(updateProfile.pending, (state) => setPending(state, "updateProfile"))
      .addCase(updateProfile.fulfilled, (state, action) => {
        setSuccess(state, "updateProfile", action);
        if (action.payload?.data) {
          state.user = { ...(state.user || {}), ...action.payload.data };
        }
      })
      .addCase(updateProfile.rejected, (state, action) =>
        setFail(state, "updateProfile", action, "Failed to update profile")
      )
      .addCase(logoutUser.pending, (state) => setPending(state, "logout"))
      .addCase(logoutUser.fulfilled, (state, action) => {
        setSuccess(state, "logout", action);
        state.user = null;
        state.token = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        setFail(state, "logout", action, "Failed to logout");
        state.user = null;
        state.token = null;
      });
  },
});

export const { clearAuthState, setUserFromProfile } = authSlice.actions;
export default authSlice.reducer;
