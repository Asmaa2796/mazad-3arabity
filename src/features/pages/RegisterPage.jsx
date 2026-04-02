import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../Redux/Slices/authSlice";
import { useLanguage } from "../../shared/i18n/LanguageProvider";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+\d{10,15}$/;
const passwordRegex = /^\d{5,}$/;

const RegisterPage = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth.register);
  const loading = status === "loading";

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "",
    accept_terms: false,
    image: null,
  });
  const [clientError, setClientError] = useState("");

  const isDisabled = useMemo(() => {
    const required = ["name", "phone", "email", "password", "password_confirmation", "role"];
    return loading || required.some((key) => !String(form[key]).trim()) || !form.accept_terms;
  }, [form, loading]);

  const validate = () => {
    if (isDisabled) return t.auth.validation.required;
    if (!emailRegex.test(form.email)) return t.auth.validation.invalidEmail;
    if (!phoneRegex.test(form.phone)) return t.auth.validation.invalidPhone;
    if (!passwordRegex.test(form.password)) return t.auth.validation.weakPassword;
    if (form.password !== form.password_confirmation) return t.auth.validation.passwordMismatch;
    if (!["seller", "buyer"].includes(form.role)) return t.auth.validation.roleRequired;
    if (!form.accept_terms) return t.auth.validation.termsRequired;
    if (form.image) {
      const allowed = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowed.includes(form.image.type)) return t.auth.validation.imageType;
      if (form.image.size > 4 * 1024 * 1024) return t.auth.validation.imageSize;
    }
    return "";
  };

  const handleChange = (e) => {
    setClientError("");
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") return setForm((prev) => ({ ...prev, [name]: checked }));
    if (type === "file") return setForm((prev) => ({ ...prev, image: files?.[0] || null }));
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) return setClientError(validationError);

    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) navigate("/verify-otp");
  };

  return (
    <main className="container py-5">
      <motion.section className="auth-shell auth-shell-register mx-auto shadow-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* <div className="auth-side"> */}
        <div className="auth-side">
          <div className="bg-white w-50 mx-auto p-2 d-flex justify-content-center rounded">

        <img src="/logo.png" width={100} height={100} alt="Mazad Logo" className="mx-auto" />
          </div>

          <h1 className="h3 my-3 text-center">{t.auth.registerTitle}</h1>
          <p className="mb-0 opacity-75 text-center">{t.auth.registerDesc}</p>
        </div>
       
        {/* </div> */}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="row g-3">
            <div className="col-md-6"><label className="form-label">{t.auth.name}</label><motion.input whileFocus={{ scale: 1.01 }} className="form-control" name="name" value={form.name} placeholder={t.auth.placeholders.name} onChange={handleChange} /></div>
            <div className="col-md-6"><label className="form-label">{t.auth.phone}</label><motion.input whileFocus={{ scale: 1.01 }} className="form-control" name="phone" value={form.phone} placeholder={t.auth.placeholders.phone} onChange={handleChange} /></div>
            <div className="col-md-6"><label className="form-label">{t.auth.email}</label><motion.input whileFocus={{ scale: 1.01 }} className="form-control" type="email" name="email" value={form.email} placeholder={t.auth.placeholders.email} onChange={handleChange} /></div>
            <div className="col-md-6"><label className="form-label">{t.auth.role}</label><select className="form-select" name="role" value={form.role} onChange={handleChange}><option value="">--</option><option value="seller">{t.auth.seller}</option><option value="buyer">{t.auth.buyer}</option></select></div>
            <div className="col-md-6"><label className="form-label">{t.auth.password}</label><motion.input whileFocus={{ scale: 1.01 }} className="form-control" type="password" name="password" value={form.password} placeholder={t.auth.placeholders.password} onChange={handleChange} /></div>
            <div className="col-md-6"><label className="form-label">{t.auth.confirmPassword}</label><motion.input whileFocus={{ scale: 1.01 }} className="form-control" type="password" name="password_confirmation" value={form.password_confirmation} placeholder={t.auth.placeholders.confirmPassword} onChange={handleChange} /></div>
            <div className="col-12"><label className="form-label">{t.auth.image}</label><input className="form-control" type="file" name="image" accept=".jpg,.jpeg,.png,image/jpeg,image/png" onChange={handleChange} /></div>
            <div className="col-12 form-check"><input className="form-check-input" id="accept_terms" type="checkbox" name="accept_terms" checked={form.accept_terms} onChange={handleChange} /><label htmlFor="accept_terms" className="form-check-label">{t.auth.acceptTerms}</label></div>
          </div>

          {(clientError || error) && <div className="alert alert-danger mb-0">{clientError || error}</div>}
          <div className="d-flex gap-2 flex-wrap">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn btn-main-color px-4" type="submit" disabled={isDisabled}>
              {loading ? t.contact.sending : t.auth.submitRegister}
            </motion.button>
            <Link to="/login" className="btn btn-outline-primary">{t.auth.goToLogin}</Link>
          </div>
        </form>
      </motion.section>
    </main>
  );
};

export default RegisterPage;
