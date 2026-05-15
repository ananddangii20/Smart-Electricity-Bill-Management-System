import { createContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('ebms_token'));
    const [user, setUser] = useState(() => {
        const raw = localStorage.getItem('ebms_user');
        return raw ? JSON.parse(raw) : null;
    });

    useEffect(() => {
        if (token) {
            localStorage.setItem('ebms_token', token);
        } else {
            localStorage.removeItem('ebms_token');
        }
    }, [token]);

    useEffect(() => {
        if (user) {
            localStorage.setItem('ebms_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('ebms_user');
        }
    }, [user]);

    const login = (authToken, authUser) => {
        setToken(authToken);
        setUser(authUser);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
    };

    const value = useMemo(
        () => ({ token, user, isAuthenticated: Boolean(token), login, logout }),
        [token, user]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
