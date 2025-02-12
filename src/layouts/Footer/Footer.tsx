import "./Footer.css";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer__content">
                <div className="footer__left">
                    <div className="footer__logo">
                        <img
                            src="/src/assets/champion-logo.svg"
                            alt="Champion Logo"
                            className="footer__logo-image"
                        />
                    </div>
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
