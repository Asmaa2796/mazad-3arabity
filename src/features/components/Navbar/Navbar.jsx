import { Link } from "react-router-dom";
import { IconCar, IconMenu3, IconPlus, IconSearch, IconUser } from '@tabler/icons-react';
import Collapse from "bootstrap/js/dist/collapse";
const Navbar = () => {
    const handleNavLinkClick = () => {
        if (window.innerWidth < 992) {
            const navbarCollapse = document.getElementById("navbarNav");
            if (navbarCollapse) {
                const bsCollapse = Collapse.getInstance(navbarCollapse) || new Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        }
    };
    return (
        <div className="">
            <div className="topbar sub-bg py-2 text-sm">
                <div className="container">
                    <div className="d-flex justify-content-between">
                        <div className="text-white"><IconCar size={17} /> سيارتك الجديدة في انتظارك… شارك في المزادات لحظة بلحظة.</div>
                        <div className="text-white">English</div>
                    </div>
                </div>
            </div>
            <nav className="navbar navbar-expand-lg shadow-sm">
                <div className="container">
                    <Link className="navbar-brand" to="/"><img src="/logo.png" alt="Mazad Logo" /></Link>
                    <button className="navbar-toggler text-white border-light-subtle" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <IconMenu3 color="var(--sub-color)" size={20} />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav mx-auto p-0">
                            <li className="nav-item">
                                <Link className="nav-link" onClick={handleNavLinkClick} to="/">الرئيسية</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" onClick={handleNavLinkClick} to="/services">الخدمات</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" onClick={handleNavLinkClick} to="/mazad">المزادات</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" onClick={handleNavLinkClick} to="/about-us">عن مزاد عربيتي</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" onClick={handleNavLinkClick} to="/contact-us">تواصل معنا</Link>
                            </li>
                        </ul>
                        <div className="actions">
                            <Link onClick={handleNavLinkClick} to="/create-ad" className="btn px-2 btn-success rounded-5 btn-sm shadow-sm text-sm mx-1"><IconPlus size={14} color="#fff" /> إضافة إعلان</Link>
                            <button className="btn px-1 main-color btn-sm"><IconSearch size={17} color="#333" /></button>
                            <button className="btn px-1 main-color btn-sm"><IconUser size={17} color="#333" /></button>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}
export default Navbar;
