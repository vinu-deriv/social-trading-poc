import "./Footer.css";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer__content">
                <div className="footer__left">
                    <p className="footer__copyright">
                        © {currentYear} Champion. All rights reserved.
                    </p>
                </div>
                <div className="footer__right">
                    <nav className="footer__nav">
                        <a href="#" className="footer__link">
                            Terms
                        </a>
                        <a href="#" className="footer__link">
                            Privacy
                        </a>
                        <a href="#" className="footer__link">
                            Contact
                        </a>
                    </nav>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
