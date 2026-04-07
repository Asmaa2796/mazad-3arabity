# CreateAd Complete Update TODO

## Previous (Stepper Fixed ✅)
- [x] Navbar steps disabled, active step full opacity
- [x] Step 1 shows initially, Next/Prev only navigation

## Step 1 Form Update Plan (Approved)
**API:** `BASE_URL/countries`, `BASE_URL/governorates/{countryId}`
**FormData:** `{ brand_id, description, model, manufacture_date, country_id, governorate_id, address }`
**All fields required, Selects searchable**

**Steps:**
- [x] 1. auctionsSlice.js - Add `fetchCountries`, `fetchGovernorates(countryId)` thunks + states (extraReducers added)
- [x] 2. store.js - Ensure auctions reducer included (already exists)
- [x] 3. CreateAd.jsx - Complete Step 1 form: 3 searchable Selects (brand_id, country_id, governorate_id), 4 inputs, updated validation, governorate dependency
- [ ] 4. translations.js - Add keys: country, governorate, address, placeholders
- [ ] 5. Test full flow
- [ ] 6. Complete
