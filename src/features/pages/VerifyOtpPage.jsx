import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { resendOtp, verifyOtp } from "../../Redux/Slices/authSlice";
import { useLanguage } from "../../shared/i18n/LanguageProvider";

const phoneRegex = /^\+\d{10,15}$/;
const otpRegex = /^\d{6}$/;

const VerifyOtpPage = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const verifyState = useSelector((state) => state.auth.verifyOtp);
  const resendState = useSelector((state) => state.auth.resendOtp);
  const loading = verifyState.status === "loading";
  const resendLoading = resendState.status === "loading";

  const [form, setForm] = useState({
    phone: localStorage.getItem("pending_otp_phone") || "",
    token: "",
  });
  const [clientError, setClientError] = useState("");

  const canSubmit = useMemo(
    () => !loading && form.phone.trim() && form.token.trim(),
    [form.phone, form.token, loading]
  );

  const validate = () => {
    if (!form.phone || !form.token) return t.auth.validation.required;
    if (!phoneRegex.test(form.phone)) return t.auth.validation.invalidPhone;
    if (!otpRegex.test(form.token)) return t.auth.validation.otpLength;
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
    const result = await dispatch(verifyOtp(form));
    if (verifyOtp.fulfilled.match(result)) navigate("/");
  };

  const onResend = async () => {
    if (!phoneRegex.test(form.phone)) return setClientError(t.auth.validation.invalidPhone);
    await dispatch(resendOtp(form.phone));
  };

  return (
    <main className="container py-5">
      <motion.section className="auth-shell mx-auto shadow-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="auth-side">
          <div className="bg-white w-50 mx-auto p-2 d-flex justify-content-center rounded">
            <img src="/logo.png" width={100} height={100} alt="Mazad Logo" className="mx-auto" />
          </div>
          <h1 className="h3 my-3 text-center">{t.auth.verifyTitle}</h1>
          <p className="mb-0 opacity-75 text-center">{t.auth.verifyDesc}</p>
        </div>
        {/* </div> */}

        <form onSubmit={onSubmit} className="auth-form">
          <div>
            <label className="form-label">{t.auth.phone}</label>
            <motion.input whileFocus={{ scale: 1.01 }} className="form-control" name="phone" value={form.phone} placeholder={t.auth.placeholders.phone} onChange={handleChange} />
          </div>
          <div>
            <label className="form-label">{t.auth.otpCode}</label>
            <motion.input whileFocus={{ scale: 1.01 }} className="form-control" name="token" value={form.token} placeholder={t.auth.placeholders.otpCode} onChange={handleChange} />
          </div>
          {(clientError || verifyState.error) && <div className="alert alert-danger mb-0">{clientError || verifyState.error}</div>}
          {verifyState.success && <div className="alert alert-success mb-0">{verifyState.success}</div>}
          {resendState.success && <div className="alert alert-info mb-0">{resendState.success}</div>}
          <div className="d-flex gap-2 flex-wrap">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn btn-main-color px-4" disabled={!canSubmit} type="submit">
              {loading ? t.contact.sending : t.auth.submitVerify}
            </motion.button>
            <button className="btn btn-outline-primary" type="button" onClick={onResend} disabled={resendLoading}>
              {resendLoading ? t.contact.sending : t.auth.resendOtp}
            </button>
            <Link to="/login" className="btn btn-light border">{t.auth.submitLogin}</Link>
          </div>
        </form>
      </motion.section>
    </main>
  );
};

export default VerifyOtpPage;
