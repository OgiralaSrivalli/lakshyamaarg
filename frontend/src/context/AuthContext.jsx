import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProfile } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [assessment, setAssessment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('lm_token');
        if (token) {
            getProfile()
                .then((res) => {
                    setUser(res.data.user);
                    setAssessment(res.data.assessment);
                })
                .catch(() => {
                    localStorage.removeItem('lm_token');
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = (token, userData) => {
        localStorage.setItem('lm_token', token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('lm_token');
        setUser(null);
        setAssessment(null);
    };

    const updateAssessment = (data) => setAssessment(data);

    return (
        <AuthContext.Provider value={{ user, assessment, loading, login, logout, updateAssessment }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
