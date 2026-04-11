# Forgot Password UI Implementation

## Plan Steps:
- [ ] Step 1: Extend translations.js with new auth keys (en/ar)
- [ ] Step 2: Create ForgotPasswordPage.jsx
- [ ] Step 3: Create VerifyPasswordOtpPage.jsx (with 2min resend timer)
- [ ] Step 4: Create ResetPasswordPage.jsx
- [ ] Step 5: Update TODO-UI.md complete

**Current Progress:** Complete! All 3 pages created + translations.

**Pages:**
- `/forgot-password` → ForgotPasswordPage.jsx (phone → OTP sent)
- `/forgot/verify-otp` → VerifyPasswordOtpPage.jsx (phone+OTP, 120s resend timer → reset)
- `/forgot/reset-password` → ResetPasswordPage.jsx (phone+pw+confirm → login)

**Next:** Add routes in App.jsx:
```jsx
<Route path="/forgot-password" element={<ForgotPasswordPage />} />
<Route path="/forgot/verify-otp" element={<VerifyPasswordOtpPage />} />
<Route path="/forgot/reset-password" element={<ResetPasswordPage />} />
```
localStorage: 'pending_forgot_phone' for flow.

Test: npm start, navigate /forgot-password.
