import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL, getCurrentLanguage, getToken } from "../../shared/utils.js/utils";

const normalizeError = (error) =>
  error?.response?.data?.message || error?.message || "Something went wrong";

const createAsyncState = () => ({
  data: null,
  status: "idle",
  error: null,
  language: null,
  pagination: null,
  page: 1,
  hasMore: true
});

const initialState = {
  settings: createAsyncState(),
  banners: createAsyncState(),
  brands: createAsyncState(),
  about: createAsyncState(),
  privacy: createAsyncState(),
  terms: createAsyncState(),
  faqs: createAsyncState(),
  notifications: createAsyncState()
};

export const fetchSettings = createAsyncThunk("content/fetchSettings", async (_, thunkAPI) => {
  try {
    const token = getToken();
    const currentLang = getCurrentLanguage();
    const response = await axios.get(`${BASE_URL}/settings`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Accept-Language": currentLang,
      },
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(normalizeError(error));
  }
});

export const fetchBanners = createAsyncThunk("content/fetchBanners", async (_, thunkAPI) => {
  try {
    const token = getToken();
    const currentLang = getCurrentLanguage();
    const response = await axios.get(`${BASE_URL}/banners`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Accept-Language": currentLang,
      },
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(normalizeError(error));
  }
});

export const fetchBrands = createAsyncThunk("content/fetchBrands", async ({ search = "", lang }, thunkAPI) => {
  try {
    const token = getToken();
    const currentLang = lang || getCurrentLanguage();
    const query = String(search || "").trim();
    const url = query ? `${BASE_URL}/brands?search=${encodeURIComponent(query)}` : `${BASE_URL}/brands`;
    const response = await axios.get(url, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Accept-Language": currentLang,
      },
    });
    return { ...response.data, _search: query };
  } catch (error) {
    return thunkAPI.rejectWithValue(normalizeError(error));
  }
});

export const fetchAbout = createAsyncThunk("content/fetchAbout", async (_, thunkAPI) => {
  try {
    const token = getToken();
    const currentLang = getCurrentLanguage();
    const response = await axios.get(`${BASE_URL}/about-us`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Accept-Language": currentLang,
      },
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(normalizeError(error));
  }
});

export const fetchPrivacy = createAsyncThunk("content/fetchPrivacy", async (_, thunkAPI) => {
  try {
    const token = getToken();
    const currentLang = getCurrentLanguage();
    const response = await axios.get(`${BASE_URL}/privacy`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Accept-Language": currentLang,
      },
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(normalizeError(error));
  }
});

export const fetchTerms = createAsyncThunk("content/fetchTerms", async (_, thunkAPI) => {
  try {
    const token = getToken();
    const currentLang = getCurrentLanguage();
    const response = await axios.get(`${BASE_URL}/terms`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Accept-Language": currentLang,
      },
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(normalizeError(error));
  }
});

export const fetchFaqs = createAsyncThunk("content/fetchFaqs", async (_, thunkAPI) => {
  try {
    const token = getToken();
    const currentLang = getCurrentLanguage();
    const response = await axios.get(`${BASE_URL}/faq`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Accept-Language": currentLang,
      },
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(normalizeError(error));
  }
});
export const fetchNotifications = createAsyncThunk(
  "content/fetchNotifications",
  async (page = 1, thunkAPI) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      const response = await axios.get(
        `${BASE_URL}/notifications?page=${page}`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "Accept-Language": currentLang,
          },
        }
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(normalizeError(error));
    }
  }
);

const setPending = (stateKey) => (state) => {
  state[stateKey].status = "loading";
  state[stateKey].error = null;
};

const setFulfilled = (stateKey) => (state, action) => {
  const payload = action.payload;

  state[stateKey].status = "succeeded";
  state[stateKey].language = getCurrentLanguage();
  state[stateKey].error = null;

  if (stateKey === "notifications") {
    const newData = payload?.data ?? [];

    const pagination = payload?.pagination?.pagination;

    const currentPage = pagination?.current_page;
    const lastPage = pagination?.last_page;

    state.notifications.data = newData;

    state.notifications.pagination = pagination;
    state.notifications.page = currentPage;
    state.notifications.hasMore = currentPage < lastPage;

    return;
  }

  state[stateKey].data = payload?.data ?? payload;
};

const setRejected = (stateKey) => (state, action) => {
  state[stateKey].status = "failed";
  state[stateKey].error = action.payload || "Failed to load data";
};

const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, setPending("settings"))
      .addCase(fetchSettings.fulfilled, setFulfilled("settings"))
      .addCase(fetchSettings.rejected, setRejected("settings"))
      .addCase(fetchBanners.pending, setPending("banners"))
      .addCase(fetchBanners.fulfilled, setFulfilled("banners"))
      .addCase(fetchBanners.rejected, setRejected("banners"))
      .addCase(fetchBrands.pending, setPending("brands"))
      .addCase(fetchBrands.fulfilled, setFulfilled("brands"))
      .addCase(fetchBrands.rejected, setRejected("brands"))
      .addCase(fetchAbout.pending, setPending("about"))
      .addCase(fetchAbout.fulfilled, setFulfilled("about"))
      .addCase(fetchAbout.rejected, setRejected("about"))
      .addCase(fetchPrivacy.pending, setPending("privacy"))
      .addCase(fetchPrivacy.fulfilled, setFulfilled("privacy"))
      .addCase(fetchPrivacy.rejected, setRejected("privacy"))
      .addCase(fetchTerms.pending, setPending("terms"))
      .addCase(fetchTerms.fulfilled, setFulfilled("terms"))
      .addCase(fetchTerms.rejected, setRejected("terms"))
      .addCase(fetchFaqs.pending, setPending("faqs"))
      .addCase(fetchFaqs.fulfilled, setFulfilled("faqs"))
      .addCase(fetchFaqs.rejected, setRejected("faqs"))
      .addCase(fetchNotifications.pending, setPending("notifications"))
      .addCase(fetchNotifications.fulfilled, setFulfilled("notifications"))
      .addCase(fetchNotifications.rejected, setRejected("notifications"));
  },
});

export default contentSlice.reducer;
