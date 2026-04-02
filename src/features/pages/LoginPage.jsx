import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../Redux/Slices/authSlice";
import { useLanguage } from "../../shared/i18n/LanguageProvider";

const phoneRegex = /^\+\d{10,15}$/;
const passwordRegex = /^\d{5,}$/;

const LoginPage = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth.login);
  const loading = status === "loading";

  const [form, setForm] = useState({ phone: "", password: "" });
  const [clientError, setClientError] = useState("");

  const isDisabled = useMemo(
    () => loading || Object.values(form).some((v) => !String(v).trim()),
    [form, loading]
  );

  const validate = () => {
    if (!form.phone || !form.password) return t.auth.validation.required;
    if (!phoneRegex.test(form.phone)) return t.auth.validation.invalidPhone;
    if (!passwordRegex.test(form.password)) return t.auth.validation.weakPassword;
    return "";
  };

  const handleChange = (e) => {
    setClientError("");
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) return setClientError(validationError);

    const result = await dispatch(loginUser(form));
    const responseCode = result?.payload?.code;
    const responseStatus = result?.payload?.status;

    if (responseCode === 415 || responseStatus === 415) {
      navigate("/verify-otp");
      return;
    }

    if (loginUser.fulfilled.match(result)) {
      navigate("/");
      return;
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

          <h1 className="h3 my-3 text-center">{t.auth.loginTitle}</h1>
          <p className="mb-0 opacity-75 text-center">{t.auth.loginDesc}</p>
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

          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <label className="form-label">{t.auth.password}</label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              className="form-control"
              name="password"
              type="password"
              placeholder={t.auth.placeholders.password}
              value={form.password}
              onChange={handleChange}
            />
          </motion.div>

          {(clientError || error) && <div className="alert alert-danger mb-0">{clientError || error}</div>}

          <div className="d-flex gap-2 flex-wrap">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn btn-main-color px-4" disabled={isDisabled} type="submit">
              {loading ? t.contact.sending : t.auth.submitLogin}
            </motion.button>
            <Link to="/register" className="btn btn-outline-primary">{t.auth.goToRegister}</Link>
          </div>

          {/* <Link to="/verify-otp" className="text-decoration-underline">{t.auth.goToVerify}</Link> */}
        </form>
      </motion.section>
    </main>
  );
};

export default LoginPage;
