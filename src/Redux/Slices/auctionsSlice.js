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
  pagination: null
});

const initialState = {
  auctions: createAsyncState(),
  auctionDetails: createAsyncState(),
  allBids: createAsyncState(),
  countries: createAsyncState(),
  governorates: createAsyncState()
};

export const fetchAuctions = createAsyncThunk("auctions/fetchAuctions", async (page = 1, thunkAPI) => {
  try {
    const token = getToken();
    const currentLang = getCurrentLanguage();
    const response = await axios.get(`${BASE_URL}/auctions?page=${page}`, {
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

export const fetchAuctionDetails = createAsyncThunk(
  "auctions/fetchAuctionDetails",
  async (id, thunkAPI) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      const response = await axios.get(
        `${BASE_URL}/auctions/${id}`,
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
export const fetchAllBids = createAsyncThunk(
  "auctions/allBids",
  async (id, thunkAPI) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      const response = await axios.get(
        `${BASE_URL}/bids/${id}`,
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

export const fetchCountries = createAsyncThunk("auctions/fetchCountries", async (_, thunkAPI) => {
  try {
    const token = getToken();
    const currentLang = getCurrentLanguage();
    const response = await axios.get(`${BASE_URL}/countries?per_page=100`, {
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

export const fetchGovernorates = createAsyncThunk("auctions/fetchGovernorates", async (countryId, thunkAPI) => {
  try {
    const token = getToken();
    const currentLang = getCurrentLanguage();
    const response = await axios.get(`${BASE_URL}/governorates/${countryId}?per_page=100`, {
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

const setPending = (stateKey) => (state) => {
  state[stateKey].status = "loading";
  state[stateKey].error = null;
};

const setFulfilled = (stateKey) => (state, action) => {
  state[stateKey].status = "succeeded";
  state[stateKey].data = action.payload?.data ?? action.payload;
  state[stateKey].pagination = action.payload?.pagination ?? null;
  state[stateKey].language = getCurrentLanguage();
  state[stateKey].error = null;
};

const setRejected = (stateKey) => (state, action) => {
  state[stateKey].status = "failed";
  state[stateKey].error = action.payload || "Failed to load data";
};

const auctionsSlice = createSlice({
  name: "auctions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuctions.pending, setPending("auctions"))
      .addCase(fetchAuctions.fulfilled, setFulfilled("auctions"))
      .addCase(fetchAuctions.rejected, setRejected("auctions"))

      .addCase(fetchAuctionDetails.pending, setPending("auctionDetails"))
      .addCase(fetchAuctionDetails.fulfilled, setFulfilled("auctionDetails"))
      .addCase(fetchAuctionDetails.rejected, setRejected("auctionDetails"))

      .addCase(fetchAllBids.pending, setPending("allBids"))
      .addCase(fetchAllBids.fulfilled, setFulfilled("allBids"))
      .addCase(fetchAllBids.rejected, setRejected("allBids"))
      
      .addCase(fetchCountries.pending, setPending("countries"))
      .addCase(fetchCountries.fulfilled, setFulfilled("countries"))
      .addCase(fetchCountries.rejected, setRejected("countries"))
      
      .addCase(fetchGovernorates.pending, setPending("governorates"))
      .addCase(fetchGovernorates.fulfilled, setFulfilled("governorates"))
      .addCase(fetchGovernorates.rejected, setRejected("governorates"));
  },
});

export default auctionsSlice.reducer;