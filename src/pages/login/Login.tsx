import { useState, FormEvent } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

interface LocationState {
    from: {
        pathname: string;
    };
}

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, error, clearError, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // If user is already authenticated, redirect to home
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const from = (location.state as LocationState)?.from?.pathname || '/';

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        try {
            setIsSubmitting(true);
            clearError();
            await login(username, password);
            navigate(from, { replace: true });
        } catch (err) {
            // Error is handled by the auth context
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-content">
                <div className="login-branding">
                    <div className="branding-content">
                        <img src="/vite.svg" alt="Logo" className="logo" />
                        <h1>Champion Social Trade</h1>
                        <p>Connect with expert traders and copy their strategies</p>
                    </div>
                </div>
                <div className="login-form-container">
                    <div className="form-wrapper">
                        <h2>Log in to your account</h2>
                        <form className="login-form" onSubmit={handleSubmit}>
                            {error && (
                                <div className="login-error">
                                    {error}
                                </div>
                            )}
                            <div className="input-wrapper">
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="input-wrapper">
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="login-button"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Logging in...' : 'Log in'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
