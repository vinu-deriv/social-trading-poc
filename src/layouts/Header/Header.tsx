import "./Header.css";

const Header = () => {
    return (
        <header className="header">
            <div className="header__content">
                <div className="header__left">
                    <div className="header__logo">
                        <img
                            src="/champion_logo-blue.svg"
                            alt="Champion Logo"
                            className="header__logo-image"
                        />
                        <span>Social Trader</span>
                    </div>
                    <nav className="header__nav">
                        {/* Navigation items will go here */}
                    </nav>
                </div>
                <div className="header__right">
                    <div className="header__actions">
                        {/* User menu, notifications, etc. will go here */}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
