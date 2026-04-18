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
  postAuction: createAsyncState(),
  postBid: createAsyncState(),
  acceptOffer: createAsyncState(),
  activeAuctionId: null,
  currentType: null,
};

export const fetchAuctions = createAsyncThunk("auctions/fetchAuctions", async ({ type, page = 1 } = {}, thunkAPI) => {
  try {
    const token = getToken();
    const currentLang = getCurrentLanguage();
    let url = `${BASE_URL}/auctions`;
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    params.append('page', page);
    url += `?${params.toString()}`;
    const response = await axios.get(url, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Accept-Language": currentLang,
      },
    });
    return { ...response.data, type };
  } catch (error) {
    return thunkAPI.rejectWithValue(normalizeError(error));
  }
});

// ... all other thunks unchanged: fetchAuctionDetails, fetchAllBids, etc.

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

export const fetchCountries = createAsyncThunk("auctions/fetchCountries", async (lang, thunkAPI) => {
  try {
    const token = getToken();
    const response = await axios.get(`${BASE_URL}/countries?per_page=100`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Accept-Language": lang,
      },
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(normalizeError(error));
  }
});

export const postAuction = createAsyncThunk(
  "auctions/postAuction",
  async (auctionData, thunkAPI) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      // Create FormData for files
      const formData = new FormData();
      Object.keys(auctionData).forEach(key => {
        if (key === 'gallery') {
          auctionData[key].forEach((file, index) => {
            if (file) formData.append(`gallery[${index}]`, file);
          });
        } else if (auctionData[key] instanceof File) {
          formData.append(key, auctionData[key]);
        } else if (auctionData[key] && auctionData[key].value !== undefined) {
          // Select objects
          formData.append(key, auctionData[key].value);
        } else if (auctionData[key] !== null && auctionData[key] !== '') {
          formData.append(key, auctionData[key]);
        }
      });

      const response = await axios.post(`${BASE_URL}/auctions`, formData, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Accept-Language": currentLang,
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(normalizeError(error));
    }
  }
);
export const postBid = createAsyncThunk(
  "auctions/postBid",
  async (bidData, thunkAPI) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      const response = await axios.post(`${BASE_URL}/bids`, bidData, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Accept-Language": currentLang,
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(normalizeError(error));
    }
  }
);
export const acceptOffer = createAsyncThunk(
  "auctions/acceptOffer",
  async (id, thunkAPI) => {
    try {
      const token = getToken();
      const currentLang = getCurrentLanguage();

      const response = await axios.post(`${BASE_URL}/bids/${id}/accept`,{}, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Accept-Language": currentLang,
          'Content-Type': 'application/json',
        },
      });

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
  state[stateKey].status = "succeeded";
  state[stateKey].data = action.payload?.data ?? action.payload;
  state[stateKey].pagination = action.payload?.pagination ?? null;
  state[stateKey].language = getCurrentLanguage();
  state[stateKey].error = null;
  if (stateKey === 'auctions' && action.meta.arg?.type) {
    state.currentType = action.meta.arg.type;
  }
};

const setRejected = (stateKey) => (state, action) => {
  state[stateKey].status = "failed";
  state[stateKey].error = action.payload || "Failed to load data";
};

const auctionsSlice = createSlice({
  name: "auctions",
  initialState,
  reducers: {
    setActiveAuctionId: (state, action) => {
    state.activeAuctionId = action.payload;
  },
  },
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

      // postAuction cases
      .addCase(postAuction.pending, setPending("postAuction"))
      .addCase(postAuction.fulfilled, setFulfilled("postAuction"))
      .addCase(postAuction.rejected, setRejected("postAuction"))

      // postBid cases
      .addCase(postBid.pending, setPending("postBid"))
      .addCase(postBid.fulfilled, setFulfilled("postBid"))
      .addCase(postBid.rejected, setRejected("postBid"))

      // acceptOffer cases
      .addCase(acceptOffer.pending, setPending("acceptOffer"))
      .addCase(acceptOffer.fulfilled, setFulfilled("acceptOffer"))
      .addCase(acceptOffer.rejected, setRejected("acceptOffer"));
  },
});
export const { setActiveAuctionId } = auctionsSlice.actions;
export default auctionsSlice.reducer;

