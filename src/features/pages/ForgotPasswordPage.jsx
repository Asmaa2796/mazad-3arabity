import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../Redux/Slices/authSlice";
import { useLanguage } from "../../shared/i18n/LanguageProvider";

const phoneRegex = /^\+\d{10,15}$/;

const ForgotPasswordPage = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, success } = useSelector((state) => state.auth.forgotPassword);
  const loading = status === "loading";

  const [form, setForm] = useState({ phone: "" });
  const [clientError, setClientError] = useState("");

  const isDisabled = useMemo(() => loading || !form.phone.trim(), [form.phone, loading]);

  const validate = () => {
    if (!form.phone.trim()) return t.auth.validation.required;
    if (!phoneRegex.test(form.phone)) return t.auth.validation.invalidPhone;
    return "";
  };

  const handleChange = (e) => {
    setClientError("");
    setForm((prev) => ({ ...prev, phone: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) return setClientError(validationError);

    const result = await dispatch(forgotPassword(form));
    if (forgotPassword.fulfilled.match(result)) {
      localStorage.setItem("pending_forgot_phone", form.phone);
      navigate("/forgot/verify-otp");
    }
  };

  return (
    <main className="container py-5">
      <motion.section
        className="auth-shell mx-auto shadow-sm border border-1 border-primary rounded-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="auth-side">
          <div className="bg-white w-50 mx-auto p-2 d-flex justify-content-center rounded">
            <img src="/logo.png" width={100} height={100} alt="Mazad Logo" className="mx-auto" />
          </div>
          <h1 className="h3 my-3 text-center">{t.auth.forgotPasswordTitle}</h1>
          <p className="mb-0 opacity-75 text-center">{t.auth.forgotPasswordDesc}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <label className="form-label">{t.auth.phone}</label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              className="form-control"
              name="phone"
              type="text"
              placeholder={t.auth.placeholders.phone}
              value={form.phone}
              onChange={handleChange}
            />
          </motion.div>

          {(clientError || error) && <div className="alert alert-danger mb-0">{clientError || error}</div>}
          {success && <div className="alert alert-success mb-0">{success}</div>}

          <div className="d-flex gap-2 flex-wrap">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn btn-main-color px-4" disabled={isDisabled} type="submit">
              {loading ? t.contact.sending : t.auth.submitVerify}
            </motion.button>
            <Link to="/login" className="btn btn-outline-primary">{t.auth.goToLogin}</Link>
          </div>
        </form>
      </motion.section>
    </main>
  );
};

export default ForgotPasswordPage;
