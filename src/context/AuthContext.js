"use client";

import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-hot-toast';


export const AuthContext = createContext();


const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);


    const getUserFromToken = () => {
        const token = localStorage.getItem('healthToken');
        console.log(token, "token")
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUser(decodedToken);
            } catch (error) {
                toast.error('Failed to decode token');
                setUser(null);
            }
        } else {
            setUser(null);
        }
    };

    useEffect(() => {
        getUserFromToken();
    }, []);


    const login = (token) => {
        localStorage.setItem('healthToken', token);
        getUserFromToken();
        toast.success('Logged in successfully!');
    };

    const logout = () => {
        localStorage.removeItem('healthToken');
        setUser(null);
        toast.success('Logged out successfully!');
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
