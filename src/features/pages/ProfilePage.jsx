import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, updateProfile } from "../../Redux/Slices/authSlice";
import { useLanguage } from "../../shared/i18n/LanguageProvider";

const ProfilePage = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const { token, user, profile, updateProfile: updateState } = useSelector((state) => state.auth);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (token && profile.status === "idle") dispatch(fetchProfile());
  }, [token, profile.status, dispatch]);

  useEffect(() => {
    setName(user?.name || "");
  }, [user?.name]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    dispatch(updateProfile({ name: name.trim(), image }));
  };

  if (!token) {
    return <div className="container py-5 text-center">Please login first.</div>;
  }

  return (
    <main className="container py-5">
      <motion.section className="bg-white rounded-4 shadow-sm p-4 p-md-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="d-flex align-items-center gap-3 mb-4">
          <img src={user?.image || "/logo.png"} alt={user?.name || "profile"} width={80} height={80} className="rounded-circle object-fit-cover border" />
          <div>
            <h1 className="h4 mb-1">{t.profile.title}</h1>
            <p className="text-secondary mb-0">{user?.email || user?.phone}</p>
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-6"><strong>{t.profile.name}:</strong> {user?.name || "-"}</div>
          <div className="col-md-6"><strong>{t.profile.role}:</strong> {user?.role || "-"}</div>
          <div className="col-md-6"><strong>{t.profile.phone}:</strong> {user?.phone || "-"}</div>
          <div className="col-md-6"><strong>{t.profile.email}:</strong> {user?.email || "-"}</div>
        </div>

        <form onSubmit={onSubmit} className="row g-3">
          <div className="col-md-6">
            <label className="form-label">{t.profile.name}</label>
            <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">{t.profile.image}</label>
            <input className="form-control" type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png" onChange={(e) => setImage(e.target.files?.[0] || null)} />
          </div>
          {updateState.error && <div className="col-12 alert alert-danger mb-0">{updateState.error}</div>}
          {updateState.success && <div className="col-12 alert alert-success mb-0">{updateState.success}</div>}
          <div className="col-12">
            <button className="btn btn-main-color" disabled={updateState.status === "loading"} type="submit">
              {updateState.status === "loading" ? t.contact.sending : t.profile.update}
            </button>
          </div>
        </form>
      </motion.section>
    </main>
  );
};

export default ProfilePage;
