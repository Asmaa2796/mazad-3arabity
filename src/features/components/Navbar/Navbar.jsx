import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconCar, IconMenu3, IconPlus, IconSearch } from '@tabler/icons-react';
import Collapse from "bootstrap/js/dist/collapse";
import { motion } from "framer-motion";
import { useLanguage } from "../../../shared/i18n/LanguageProvider";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, logoutUser } from "../../../Redux/Slices/authSlice";
import { toast } from "react-toastify";

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token, user } = useSelector((state) => state.auth);
    const settings = useSelector((state) => state.content.settings.data);
    const { t, toggleLanguage, language } = useLanguage();
    const links = [
        { to: "/", label: t.nav.home },
        { to: "/services", label: t.nav.services },
        { to: "/all-auctions", label: t.nav.auctions },
        { to: "/about-us", label: t.nav.about },
        { to: "/faqs", label: t.nav.faqs },
        { to: "/contact-us", label: t.nav.contact },
    ];

    const handleNavLinkClick = () => {
        if (window.innerWidth < 992) {
            const navbarCollapse = document.getElementById("navbarNav");
            if (navbarCollapse) {
                const bsCollapse = Collapse.getInstance(navbarCollapse) || new Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        }
    };

    const handleCreateAdClick = (e) => {
        handleNavLinkClick(e);
        if (!user) {
            e.preventDefault();
            toast.info(t.nav.please_login);
            setTimeout(() => {
                navigate("/login", { state: { from: "/create-ad" }, replace: true });
            }, 500);
            return;
        } else if (user.role !== "seller") {
            e.preventDefault();
            toast.warning(t.nav.you_cant_create_ad);
            setTimeout(() => {
                navigate("/", { replace: true });
            }, 500);
            return;
        }
    };

    useEffect(() => {
        if (token && !user) dispatch(fetchProfile());
    }, [token, user, dispatch]);

    const handleLogout = async () => {
        await dispatch(logoutUser());
        navigate("/login");
    };

    return (
        <div className="">
            <div className="topbar sub-bg py-2 text-sm">
                <div className="container">
                    <div className="d-flex justify-content-between">
                        <div className="text-white"><IconCar size={17} /> {t.nav.topbar}</div>
                        <button type="button" className="btn btn-sm btn-light py-0 px-2" onClick={toggleLanguage}>
                            {t.common.switchTo}
                        </button>
                    </div>
                </div>
            </div>
            <nav className="navbar navbar-expand-lg shadow-sm">
                <div className="container">
                    <Link className="navbar-brand" to="/"><img src={settings?.logo || "/logo.png"} alt={settings?.name || "Mazad Logo"} /></Link>
                    <button className="navbar-toggler text-white border-light-subtle" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <IconMenu3 color="var(--sub-color)" size={20} />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav mx-auto p-0">
                            {links.map((link) => (
                                <li className="nav-item" key={link.to}>
                                    <Link
                                        className="nav-link"
                                        to={link.to}
                                        onClick={handleNavLinkClick}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className="actions">
                            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="d-inline-block mx-1">
                                <Link onClick={handleCreateAdClick} to="/create-ad" className="btn px-2 btn-success rounded-5 btn-sm shadow-sm text-sm"><IconPlus size={14} color="#fff" /> {t.nav.createAd}</Link>
                            </motion.div>
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="btn px-1 main-color btn-sm"><IconSearch size={17} color="#333" /></motion.button>
                            {token ? (
                                <div className="dropdown d-inline-block">
                                    <button className="btn p-0 border-0 bg-transparent" data-bs-toggle="dropdown" aria-expanded="false">
                                        <img
                                            src={user?.image || "/logo.png"}
                                            alt={user?.name || "profile"}
                                            width={34}
                                            height={34}
                                            className="rounded-circle border object-fit-cover"
                                        />
                                    </button>
                                    <ul className="dropdown-menu" style={{ textAlign: language === "ar" ? "right" : "left" }}>
                                        <li>
                                            <Link className="dropdown-item text-sm" to="/profile">{t.profile.visit}</Link>
                                        </li>
                                        <li>
                                            <button className="dropdown-item text-sm" type="button" onClick={handleLogout}>{t.profile.logout}</button>
                                        </li>
                                    </ul>
                                </div>
                            ) : (
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="d-inline-block">
                                    <Link to="/login" className="btn px-1 main-color btn-sm" aria-label={t.nav.login}>{t.nav.login}</Link>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}
export default Navbar;