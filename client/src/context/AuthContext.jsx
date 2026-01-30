import { createContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // API_URL is handled in api.js, but we might expose the base for informational purposes if needed
    const API_URL = 'http://localhost:5005/api';

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                // Set default header for future requests
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                try {
                    const res = await api.get('/auth/user');
                    setUser(res.data);
                } catch (err) {
                    console.error("Auth Error", err);
                    localStorage.removeItem('token');
                    delete api.defaults.headers.common['Authorization'];
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        // Fetch user details immediately
        const userRes = await api.get('/auth/user');
        setUser(userRes.data);
    };

    const register = async (name, email, password) => {
        const res = await api.post('/auth/register', { name, email, password });
        localStorage.setItem('token', res.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        const userRes = await api.get('/auth/user');
        setUser(userRes.data);
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, API_URL }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
