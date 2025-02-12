import { Link, NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/input/Button";
import "./Header.css";
import { LegacyProfileXsIcon } from "@deriv/quill-icons";

const Header = () => {
    const { isAuthenticated } = useAuth();

    return (
        <header className="header">
            <div className="header__content">
                <div className="header__left">
                    <Link to="/" className="header__logo">
                        <img
                            src="/champion_logo-blue.svg"
                            alt="Champion Logo"
                            className="header__logo-image"
                        />
                        <span className="header__logo-text">Social Trader</span>
                    </Link>
                    {isAuthenticated && (
                        <nav className="header__nav">
                            <NavLink
                                to="/feed"
                                className={({ isActive }) =>
                                    `header__nav-link ${
                                        isActive
                                            ? "header__nav-link--active"
                                            : ""
                                    }`
                                }
                            >
                                Feed
                            </NavLink>
                        </nav>
                    )}
                </div>
                <div className="header__right">
                    {isAuthenticated && (
                        <div className="header__actions">
                            <Button
                                variant="text"
                                className="header__action-btn"
                            >
                                <LegacyProfileXsIcon
                                    fill="#00d0ff"
                                    iconSize="sm"
                                />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
