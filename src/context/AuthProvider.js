import React, { createContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode"; // Install using: npm install jwt-decode

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // const [user, setUser] = useState(null);

    useEffect(() => {
        const validateToken = () => {
            const storedToken = localStorage.getItem("token");
            if (!storedToken) {
                setIsAuthenticated(false);
                return;
            }

            try {
                const decoded = jwtDecode(storedToken);
                const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds
                // console.log("decoded", decoded);
                if (decoded.exp > currentTime) {
                    setIsAuthenticated(true);
                } else {
                    logout(); // Token expired
                }
            } catch (err) {
                logout(); // Invalid token, force logout
            }
        };

        validateToken();
        // if (token) {
        //     const decoded = jwtDecode(token); // Decode token to get user data
        //     setUser({ id: decoded.id, role: decoded.role });
        //     console.log("decoded", decoded);
        // }
        const interval = setInterval(validateToken, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        
    }, [token]);

    const login = (jwtToken) => {
        localStorage.setItem("token", jwtToken);
        setToken(jwtToken);
        setIsAuthenticated(true);
        // const decoded = jwtDecode(token); // Decode token to get user data
        // setUser({ id: decoded.id, role: decoded.role });
        // console.log("decoded", decoded);
        
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
