import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL, getCurrentLanguage, getToken } from "../../shared/utils.js/utils";

const normalizeError = (error) =>
  error?.response?.data?.message || error?.message || "Something went wrong";

const initialState = {
  submit: { status: "idle", error: null, success: null },
  update: { status: "idle", error: null, success: null },
  patch: { status: "idle", error: null, success: null },
  remove: { status: "idle", error: null, success: null },
};

export const submitContactForm = createAsyncThunk(
  "contact/submitContactForm",
  async (payload, thunkAPI) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => formData.append(key, value));
      const response = await axios.post(`${BASE_URL}/contact`, formData, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Accept-Language": currentLang,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(normalizeError(error));
    }
  }
);

export const updateContactForm = createAsyncThunk(
  "contact/updateContactForm",
  async (payload, thunkAPI) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();
      const response = await axios.put(`${BASE_URL}/contact/${payload.id}`, payload.data, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Accept-Language": currentLang,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(normalizeError(error));
    }
  }
);

export const patchContactForm = createAsyncThunk(
  "contact/patchContactForm",
  async (payload, thunkAPI) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();
      const response = await axios.patch(`${BASE_URL}/contact/${payload.id}`, payload.data, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Accept-Language": currentLang,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(normalizeError(error));
    }
  }
);

export const deleteContactForm = createAsyncThunk(
  "contact/deleteContactForm",
  async (id, thunkAPI) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();
      const response = await axios.delete(`${BASE_URL}/contact/${id}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Accept-Language": currentLang,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(normalizeError(error));
    }
  }
);

const start = (state, key) => {
  state[key].status = "loading";
  state[key].error = null;
  state[key].success = null;
};

const ok = (state, key, action) => {
  state[key].status = "succeeded";
  state[key].success = action.payload?.message || "Done successfully";
};

const fail = (state, key, action) => {
  state[key].status = "failed";
  state[key].error = action.payload || "Request failed";
};

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitContactForm.pending, (state) => start(state, "submit"))
      .addCase(submitContactForm.fulfilled, (state, action) => ok(state, "submit", action))
      .addCase(submitContactForm.rejected, (state, action) => fail(state, "submit", action))
      .addCase(updateContactForm.pending, (state) => start(state, "update"))
      .addCase(updateContactForm.fulfilled, (state, action) => ok(state, "update", action))
      .addCase(updateContactForm.rejected, (state, action) => fail(state, "update", action))
      .addCase(patchContactForm.pending, (state) => start(state, "patch"))
      .addCase(patchContactForm.fulfilled, (state, action) => ok(state, "patch", action))
      .addCase(patchContactForm.rejected, (state, action) => fail(state, "patch", action))
      .addCase(deleteContactForm.pending, (state) => start(state, "remove"))
      .addCase(deleteContactForm.fulfilled, (state, action) => ok(state, "remove", action))
      .addCase(deleteContactForm.rejected, (state, action) => fail(state, "remove", action));
  },
});

export default contactSlice.reducer;
