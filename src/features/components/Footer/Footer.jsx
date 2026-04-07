import { Link } from 'react-router-dom';
import style from './footer.module.css';
import { IconPhone,IconMail,IconWorld } from '@tabler/icons-react';
import { useLanguage } from '../../../shared/i18n/LanguageProvider';
import { useSelector } from 'react-redux';
const Footer = () => {
    const { t } = useLanguage();
    const settings = useSelector((state) => state.content.settings.data);
    const links = [
        { to: "/", label: t.nav.home },
        { to: "/services", label: t.nav.services },
        { to: "/all-auctions", label: t.nav.auctions },
        { to: "/about-us", label: t.nav.about },
        { to: "/privacy", label: t.nav.privacy },
        { to: "/terms", label: t.nav.terms },
        { to: "/faqs", label: t.nav.faqs },
        { to: "/contact-us", label: t.nav.contact },
    ];

    return (
        <footer className={`${style.footer} py-5`}>
            <div className="container">
                <div className="row align-items-start">
                    <div className="col-md-4 mb-4">
                    <img src={settings?.logo || "/logo-w.png"} alt='Logo'/>
                        <p className="text-light opacity-75">
                            {settings?.desc || t.footer.desc}
                        </p>
                    </div>

                    <div className="col-md-4 mb-4">
                        <h5 className="fw-semibold mb-3">{t.footer.quickLinks}</h5>
                        <ul className="list-unstyled p-0">
                            {links.map((link) => (
                                <li key={link.to}>
                                    <Link to={link.to} className="text-white-50 text-decoration-none">{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="col-md-4 mb-4">
                        <h5 className="fw-semibold mb-3">{t.footer.stayConnected}</h5>
                        <p className="text-white-50 mb-1"><IconPhone className='sub-color' size={18}/> <span className='d-inline-block' style={{direction:"ltr"}}>{settings?.phone || "+1 (555) 123-4567"}</span></p>
                        <p className="text-white-50 mb-1"><IconMail className='sub-color' size={18}/> {settings?.support || settings?.email}</p>
                        <p className="text-white-50"><IconWorld className='sub-color' size={18}/> {settings?.address || "www.mazad.com"}</p>
                    </div>
                </div>

                <hr className="border-secondary" />
                <div className="text-center mt-3">
                    <small className="text-white-50">
                        {settings?.copyright || `© ${new Date().getFullYear()} ${t.footer.rights}`}
                    </small>
                </div>
            </div>
        </footer>
    );
}

export default Footer;