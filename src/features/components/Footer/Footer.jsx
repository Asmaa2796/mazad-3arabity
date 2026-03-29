import { Link } from 'react-router-dom';
import style from './footer.module.css';
import { IconPhone,IconMail,IconWorld } from '@tabler/icons-react';
const Footer = () => {
    return (
        <footer className={`${style.footer} py-5`}>
            <div className="container">
                <div className="row align-items-start">
                    <div className="col-md-4 mb-4">
                    <img src="/logo-w.png" alt='Logo'/>
                        <p className="text-light opacity-75">
                            تابع أحدث المزادات مباشرة وشاهد السيارات المعروضة بوضوح، وشارك في المنافسة لحظة بلحظة بسهولة وسرعة
                        </p>
                    </div>

                    <div className="col-md-4 mb-4">
                        <h5 className="fw-semibold mb-3">روابط سريعة</h5>
                        <ul className="list-unstyled p-0">
                            <li><Link to="/" className="text-white-50 text-decoration-none">الرئيسية</Link></li>
                            <li><Link to="/" className="text-white-50 text-decoration-none">الخدمات</Link></li>
                            <li><Link to="about-us" className="text-white-50 text-decoration-none">عن مزاد عربيتي</Link></li>
                            <li><Link to="terms-conditions" className="text-white-50 text-decoration-none">الشروط والاستخدام</Link></li>
                            <li><Link to="/" className="text-white-50 text-decoration-none">تواصل معنا</Link></li>
                        </ul>
                    </div>

                    <div className="col-md-4 mb-4">
                        <h5 className="fw-semibold mb-3">ابق على تواصل</h5>
                        <p className="text-white-50 mb-1"><IconPhone className='sub-color' size={18}/> +1 (555) 123-4567</p>
                        <p className="text-white-50 mb-1"><IconMail className='sub-color' size={18}/> support@mazad.com</p>
                        <p className="text-white-50"><IconWorld className='sub-color' size={18}/> www.mazad.com</p>
                    </div>
                </div>

                <hr className="border-secondary" />
                <div className="text-center mt-3">
                    <small className="text-white-50">
                        © {new Date().getFullYear()} جميع الحقوق محفوظة | مزاد عربيتي
                    </small>
                </div>
            </div>
        </footer>
    );
}

export default Footer;