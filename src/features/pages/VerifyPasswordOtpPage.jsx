import { useEffect, useMemo, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { verifyPasswordOtp, resendPasswordOtp } from "../../Redux/Slices/authSlice";
import { useLanguage } from "../../shared/i18n/LanguageProvider";

const phoneRegex = /^\+\d{10,15}$/;
const otpRegex = /^\d{6}$/;

const VerifyPasswordOtpPage = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const verifyState = useSelector((state) => state.auth.verifyPasswordOtp);
  const resendState = useSelector((state) => state.auth.resendPasswordOtp);
  const loading = verifyState.status === "loading";
  const resendLoading = resendState.status === "loading";

  const [form, setForm] = useState({
    phone: localStorage.getItem("pending_forgot_phone") || "",
    token: "",
  });
  const [clientError, setClientError] = useState("");
  const [countdown, setCountdown] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(true);
  const intervalRef = useRef();

  useEffect(() => {
    if (countdown > 0 && !canResend) {
      intervalRef.current = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [countdown, canResend]);

  useEffect(() => {
    if (countdown === 0) {
      setCanResend(true);
      clearInterval(intervalRef.current);
    }
  }, [countdown]);

  const canSubmit = useMemo(
    () => !loading && form.phone.trim() && form.token.trim(),
    [form.phone, form.token, loading]
  );

  const validate = () => {
    if (!form.phone || !form.token) return t.auth.validation.required;
    if (!phoneRegex.test(form.phone)) return t.auth.validation.invalidPhone;
    if (!otpRegex.test(form.token)) return t.auth.validation.otpLength || t.auth.validation.passwordResetOtpLength;
    return "";
  };

  const handleChange = (e) => {
    setClientError("");
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) return setClientError(error);
    const result = await dispatch(verifyPasswordOtp({ phone: form.phone, token: form.token }));
    if (verifyPasswordOtp.fulfilled.match(result)) {
      localStorage.setItem("pending_forgot_phone", form.phone);
      navigate("/forgot/reset-password");
    }
  };

  const onResend = async () => {
    if (!phoneRegex.test(form.phone)) return setClientError(t.auth.validation.invalidPhone);
    setCanResend(false);
    setCountdown(120);
    await dispatch(resendPasswordOtp(form.phone));
  };

  const resendText = canResend ? t.auth.resendPasswordOtp : `${t.auth.resendIn} ${countdown} ${t.auth.second}`;

  return (
    <main className="container py-5">
      <motion.section className="auth-shell mx-auto shadow-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="auth-side">
          <div className="bg-white w-50 mx-auto p-2 d-flex justify-content-center rounded">
            <img src="/logo.png" width={100} height={100} alt="Mazad Logo" className="mx-auto" />
          </div>
          <h1 className="h3 my-3 text-center">{t.auth.verifyPasswordOtpTitle}</h1>
          <p className="mb-0 opacity-75 text-center">{t.auth.verifyPasswordOtpDesc}</p>
        </div>

        <form onSubmit={onSubmit} className="auth-form">
          <div>
            <label className="form-label">{t.auth.phone}</label>
            <motion.input whileFocus={{ scale: 1.01 }} className="form-control" name="phone" value={form.phone} placeholder={t.auth.placeholders.phone} onChange={handleChange} />
          </div>
          <div>
            <label className="form-label">{t.auth.passwordOtp}</label>
            <motion.input whileFocus={{ scale: 1.01 }} className="form-control" name="token" value={form.token} placeholder={t.auth.placeholders.otpCode} onChange={handleChange} />
          </div>
          {(clientError || verifyState.error) && <div className="alert alert-danger mb-0">{clientError || verifyState.error}</div>}
          {verifyState.success && <div className="alert alert-success mb-0">{verifyState.success}</div>}
          {resendState.success && <div className="alert alert-info mb-0">{resendState.success}</div>}
          <div className="d-flex gap-2 flex-wrap">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn btn-main-color px-4" disabled={!canSubmit} type="submit">
              {loading ? t.contact.sending : t.auth.submitVerify}
            </motion.button>
            <button className={`btn ${canResend ? 'btn-outline-primary' : 'btn-secondary'}`} type="button" onClick={onResend} disabled={!canResend || resendLoading}>
              {resendLoading ? t.contact.sending : resendText}
            </button>
            <Link to="/login" className="btn btn-light border">{t.auth.goToLogin}</Link>
          </div>
        </form>
      </motion.section>
    </main>
  );
};

export default VerifyPasswordOtpPage;

